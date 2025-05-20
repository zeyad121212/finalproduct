import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ChatSystem from "@/components/communication/ChatSystem";

const Messages = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
        <p className="text-muted-foreground">
          Communicate with trainers, supervisors, and team members.
        </p>
      </div>

      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Chat System</CardTitle>
          <CardDescription>
            Send and receive messages, share files, and collaborate with your
            team.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ChatSystem />
        </CardContent>
      </Card>
    </div>
  );
};

export default Messages;
