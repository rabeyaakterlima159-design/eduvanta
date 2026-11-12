// ==============================================================================
// Supabase Edge Function: sdui-config
// Serves Resolved Server-Driven UI (SDUI) Layouts & Remote Configurations
// ==============================================================================

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const url = new URL(req.url);
    const schoolId = url.searchParams.get("schoolId");
    const role = url.searchParams.get("role") || "student";
    const platform = url.searchParams.get("platform") || "android";
    const appVersion = url.searchParams.get("appVersion") || "1.0.0";

    // 1. Check Maintenance Mode
    const { data: maintenance } = await supabase
      .from("maintenance_settings")
      .select("*")
      .or(`school_id.is.null,school_id.eq.${schoolId || "00000000-0000-0000-0000-000000000000"}`)
      .eq("is_maintenance_mode", true)
      .maybeSingle();

    if (maintenance) {
      const allowedRoles = maintenance.allowed_roles || [];
      if (!allowedRoles.includes(role)) {
        return new Response(
          JSON.stringify({
            maintenance: true,
            title: maintenance.title,
            message: maintenance.message,
            startTime: maintenance.start_time,
            endTime: maintenance.end_time,
          }),
          { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // 2. Check Version Policy
    const { data: versionInfo } = await supabase
      .from("app_versions")
      .select("*")
      .eq("platform", platform)
      .eq("is_active", true)
      .maybeSingle();

    let forceUpdate = false;
    if (versionInfo) {
      // Basic semver comparison: if min_supported_version > appVersion, force update
      if (versionInfo.force_update || appVersion < versionInfo.min_supported_version) {
        forceUpdate = true;
      }
    }

    // 3. Fetch SDUI Configuration
    // Order of precedence:
    // (a) school_id match with role match
    // (b) school_id match with role is null
    // (c) school_id is null with role match
    // (d) school_id is null with role is null (Global platform fallback)
    let configQuery = supabase
      .from("app_configurations")
      .select("*")
      .eq("is_active", true);

    if (schoolId) {
      configQuery = configQuery.or(`school_id.eq.${schoolId},school_id.is.null`);
    } else {
      configQuery = configQuery.is("school_id", null);
    }

    const { data: configs } = await configQuery;

    let selectedConfig = null;
    if (configs && configs.length > 0) {
      // Find most specific match
      selectedConfig =
        configs.find((c) => c.school_id === schoolId && c.role_target === role) ||
        configs.find((c) => c.school_id === schoolId && !c.role_target) ||
        configs.find((c) => !c.school_id && c.role_target === role) ||
        configs.find((c) => !c.school_id && !c.role_target) ||
        configs[0];
    }

    // 4. Filter widgets based on user role
    const layout = selectedConfig?.layout_data || {};
    const filteredWidgets = (layout.widgets || []).filter((w: any) => {
      if (!w.visible) return false;
      if (!w.rolesAllowed || w.rolesAllowed.length === 0) return true;
      return w.rolesAllowed.includes(role);
    });

    const responsePayload = {
      maintenance: false,
      versionPolicy: {
        forceUpdate,
        latestVersion: versionInfo?.latest_version || "1.0.0",
        minSupportedVersion: versionInfo?.min_supported_version || "1.0.0",
        updateTitle: versionInfo?.update_title,
        updateMessage: versionInfo?.update_message,
        storeUrl: versionInfo?.store_url,
      },
      sdui: {
        configId: selectedConfig?.id,
        version: selectedConfig?.version || 1,
        theme: layout.theme || {},
        navigation: (layout.navigation || []).filter((n: any) =>
          !n.rolesAllowed || n.rolesAllowed.includes(role)
        ),
        widgets: filteredWidgets,
      },
    };

    return new Response(JSON.stringify(responsePayload), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || "Failed to resolve SDUI configuration" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
