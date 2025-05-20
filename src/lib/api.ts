import { supabase } from "./auth";
import { UserRole } from "./auth";

// Training requests
export async function getTrainingRequests(userRole: UserRole, userId: string) {
  let query = supabase.from("training_requests").select("*");

  // Filter based on user role
  switch (userRole) {
    case "DV":
      query = query.eq("requested_by", userId);
      break;
    case "SV":
      query = query.eq("supervisor_id", userId);
      break;
    case "PM":
      query = query.eq("program_manager_id", userId);
      break;
    case "TR":
      query = query.eq("trainer_id", userId);
      break;
    // MB and CC can see all requests
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching training requests:", error);
    return [];
  }

  return data;
}

export async function createTrainingRequest(requestData: any) {
  const { data, error } = await supabase
    .from("training_requests")
    .insert(requestData)
    .select();

  if (error) {
    console.error("Error creating training request:", error);
    throw new Error(error.message);
  }

  return data[0];
}

export async function updateTrainingRequest(id: string, updateData: any) {
  const { data, error } = await supabase
    .from("training_requests")
    .update(updateData)
    .eq("id", id)
    .select();

  if (error) {
    console.error("Error updating training request:", error);
    throw new Error(error.message);
  }

  return data[0];
}

// Trainers
export async function getTrainers() {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("role", "TR");

  if (error) {
    console.error("Error fetching trainers:", error);
    return [];
  }

  return data;
}

// AI recommendation function
export async function getRecommendedTrainers(trainingRequest: any) {
  // In a real app, this would call an AI service
  // For now, we'll simulate it by filtering trainers based on specialization and location
  const { data: trainers, error } = await supabase
    .from("users")
    .select("*")
    .eq("role", "TR")
    .eq("specialization", trainingRequest.specialization);

  if (error) {
    console.error("Error fetching recommended trainers:", error);
    return [];
  }

  // Sort by proximity to training location (simulated)
  return trainers.sort((a, b) => {
    // In a real app, this would use actual distance calculation
    if (a.region === trainingRequest.location) return -1;
    if (b.region === trainingRequest.location) return 1;
    return 0;
  });
}

// Calendar events
export async function getCalendarEvents(
  userRole: UserRole,
  userId: string,
  filters: any = {},
) {
  let query = supabase.from("training_events").select("*");

  // Filter based on user role
  switch (userRole) {
    case "DV":
      query = query.eq("region", filters.region || "");
      break;
    case "TR":
      query = query.eq("trainer_id", userId);
      break;
    case "SV":
      query = query.eq("region", filters.region || "");
      break;
    // Other roles can see all events with filters
  }

  // Apply additional filters
  if (filters.region && !["DV", "SV"].includes(userRole)) {
    query = query.eq("region", filters.region);
  }

  if (filters.department) {
    query = query.eq("department", filters.department);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching calendar events:", error);
    return [];
  }

  return data;
}

// Messages
export async function getConversations(userId: string) {
  // Get private conversations
  const { data: privateConversations, error: privateError } = await supabase
    .from("conversations")
    .select("*, participants(*)")
    .or(`participants.eq.${userId},participants.eq.${userId}`);

  if (privateError) {
    console.error("Error fetching private conversations:", privateError);
  }

  // Get group conversations
  const { data: groupConversations, error: groupError } = await supabase
    .from("group_conversations")
    .select("*, participants(*)")
    .contains("participants", [userId]);

  if (groupError) {
    console.error("Error fetching group conversations:", groupError);
  }

  return [...(privateConversations || []), ...(groupConversations || [])];
}

export async function getMessages(conversationId: string, isGroup: boolean) {
  const table = isGroup ? "group_messages" : "messages";
  const idField = isGroup ? "group_conversation_id" : "conversation_id";

  const { data, error } = await supabase
    .from(table)
    .select("*, sender:users(*)")
    .eq(idField, conversationId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching messages:", error);
    return [];
  }

  return data;
}

export async function sendMessage(
  conversationId: string,
  senderId: string,
  content: string,
  isGroup: boolean,
  mediaUrl?: string,
  mediaType?: string,
) {
  const table = isGroup ? "group_messages" : "messages";
  const idField = isGroup ? "group_conversation_id" : "conversation_id";

  const messageData = {
    [idField]: conversationId,
    sender_id: senderId,
    content,
    media_url: mediaUrl,
    media_type: mediaType,
  };

  const { data, error } = await supabase
    .from(table)
    .insert(messageData)
    .select();

  if (error) {
    console.error("Error sending message:", error);
    throw new Error(error.message);
  }

  return data[0];
}

// Offline support
export function setupOfflineSync() {
  // In a real app, this would set up service workers and IndexedDB
  // For now, we'll just return a placeholder
  return {
    syncWhenOnline: async () => {
      console.log("Syncing offline data...");
      // Implementation would depend on the offline storage solution
    },
  };
}
