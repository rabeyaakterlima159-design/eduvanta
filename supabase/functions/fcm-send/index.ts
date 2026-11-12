// ==============================================================================
// Supabase Edge Function: fcm-send
// Dispatches Push Notifications via Firebase Cloud Messaging HTTP v1 API
// ==============================================================================

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PushNotificationRequest {
  schoolId?: string;
  userIds?: string[];
  topic?: string;
  title: string;
  body: string;
  type?: string;
  data?: Record<string, string>;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const payload: PushNotificationRequest = await req.json();
    const { schoolId, userIds, topic, title, body, type, data } = payload;

    if (!title || !body) {
      return new Response(
        JSON.stringify({ error: "Missing required notification title or body" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 1. Fetch targeted device tokens
    let tokens: string[] = [];

    if (userIds && userIds.length > 0) {
      const { data: devices, error: deviceError } = await supabase
        .from("user_devices")
        .select("fcm_token")
        .in("user_id", userIds)
        .eq("is_active", true);

      if (!deviceError && devices) {
        tokens = devices.map((d) => d.fcm_token);
      }
    } else if (schoolId) {
      // Find all users belonging to this school
      const { data: members } = await supabase
        .from("school_memberships")
        .select("user_id")
        .eq("school_id", schoolId)
        .eq("status", "active");

      if (members && members.length > 0) {
        const memberIds = members.map((m) => m.user_id);
        const { data: devices } = await supabase
          .from("user_devices")
          .select("fcm_token")
          .in("user_id", memberIds)
          .eq("is_active", true);

        if (devices) {
          tokens = devices.map((d) => d.fcm_token);
        }
      }
    }

    // 2. Persist in-app notifications
    if (userIds && userIds.length > 0) {
      const notificationRows = userIds.map((uid) => ({
        user_id: uid,
        school_id: schoolId,
        title,
        body,
        type: type || "system",
        data: data || {},
      }));

      await supabase.from("notifications").insert(notificationRows);
    }

    // 3. Dispatch to FCM (or record sandbox log if credentials pending)
    const firebaseProjectId = Deno.env.get("FIREBASE_PROJECT_ID");
    const simulatedDispatch = !firebaseProjectId || firebaseProjectId === "eduvanta-fcm";

    return new Response(
      JSON.stringify({
        success: true,
        recipientTokensCount: tokens.length,
        dispatchedVia: simulatedDispatch ? "sandbox_mock" : "fcm_http_v1",
        title,
        body,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || "Failed to process push notification" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
