import React, { useState } from "react";
import {
  Search,
  Send,
  Paperclip,
  Image,
  Mic,
  MoreVertical,
  Pin,
  Hash,
  User,
  Users,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Message {
  id: string;
  sender: string;
  senderRole: string;
  content: string;
  timestamp: string;
  isMedia?: boolean;
  mediaType?: "image" | "pdf" | "voice";
  mediaUrl?: string;
}

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  isPinned: boolean;
  isGroup: boolean;
  participants?: string[];
}

const ChatSystem = () => {
  const [activeTab, setActiveTab] = useState("private");
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [messageInput, setMessageInput] = useState("");

  // Mock data for conversations
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "1",
      name: "Ahmed Hassan",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed",
      lastMessage: "When will the next training session be scheduled?",
      timestamp: "10:30 AM",
      unread: 2,
      isPinned: true,
      isGroup: false,
    },
    {
      id: "2",
      name: "Sara Mohamed",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sara",
      lastMessage: "I've uploaded the training materials",
      timestamp: "Yesterday",
      unread: 0,
      isPinned: true,
      isGroup: false,
    },
    {
      id: "3",
      name: "General Announcements",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=General",
      lastMessage: "New training guidelines have been published",
      timestamp: "2 days ago",
      unread: 5,
      isPinned: false,
      isGroup: true,
      participants: ["All users"],
    },
    {
      id: "4",
      name: "Coordination Group",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Coordination",
      lastMessage: "Meeting scheduled for tomorrow at 3 PM",
      timestamp: "3 days ago",
      unread: 0,
      isPinned: false,
      isGroup: true,
      participants: ["CC", "MB", "All DVs"],
    },
  ]);

  // Mock data for messages
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "Ahmed Hassan",
      senderRole: "DV",
      content: "When will the next training session be scheduled?",
      timestamp: "10:30 AM",
    },
    {
      id: "2",
      sender: "You",
      senderRole: "CC",
      content:
        "We are planning for next week. Let me check the availability of trainers.",
      timestamp: "10:32 AM",
    },
    {
      id: "3",
      sender: "Ahmed Hassan",
      senderRole: "DV",
      content: "Great! We need to prepare the venue accordingly.",
      timestamp: "10:35 AM",
    },
    {
      id: "4",
      sender: "Ahmed Hassan",
      senderRole: "DV",
      content: "Here is the attendance from last session.",
      timestamp: "10:36 AM",
      isMedia: true,
      mediaType: "pdf",
      mediaUrl: "#",
    },
    {
      id: "5",
      sender: "You",
      senderRole: "CC",
      content: "Thanks for sharing. I'll review it today.",
      timestamp: "10:40 AM",
    },
  ]);

  const handleSendMessage = () => {
    if (messageInput.trim() === "") return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: "You",
      senderRole: "CC",
      content: messageInput,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages([...messages, newMessage]);
    setMessageInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const togglePin = (id: string) => {
    setConversations(
      conversations.map((conv) =>
        conv.id === id ? { ...conv, isPinned: !conv.isPinned } : conv,
      ),
    );
  };

  const selectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    // Mark as read
    setConversations(
      conversations.map((conv) =>
        conv.id === conversation.id ? { ...conv, unread: 0 } : conv,
      ),
    );
  };

  return (
    <div className="flex h-[700px] w-full max-w-[850px] flex-col rounded-xl border bg-background shadow-lg">
      <div className="flex h-full">
        {/* Sidebar */}
        <div className="w-1/3 border-r">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Messages</h2>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </div>
            <div className="relative mb-4">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search messages..." className="pl-8" />
            </div>
            <Tabs
              defaultValue="private"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="private">
                  <User className="mr-2 h-4 w-4" />
                  Private
                </TabsTrigger>
                <TabsTrigger value="group">
                  <Users className="mr-2 h-4 w-4" />
                  Groups
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <ScrollArea className="h-[calc(100%-130px)]">
            <div className="p-2">
              {conversations
                .filter((conv) =>
                  activeTab === "private" ? !conv.isGroup : conv.isGroup,
                )
                .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0))
                .map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`flex items-center gap-3 rounded-lg p-2 cursor-pointer hover:bg-accent/50 ${selectedConversation?.id === conversation.id ? "bg-accent" : ""}`}
                    onClick={() => selectConversation(conversation)}
                  >
                    <Avatar>
                      <AvatarImage src={conversation.avatar} />
                      <AvatarFallback>
                        {conversation.name.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 overflow-hidden">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium truncate">
                          {conversation.name}
                        </h3>
                        <span className="text-xs text-muted-foreground">
                          {conversation.timestamp}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {conversation.lastMessage}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {conversation.isPinned && (
                        <Pin className="h-3 w-3 text-primary" />
                      )}
                      {conversation.unread > 0 && (
                        <Badge
                          variant="default"
                          className="h-5 w-5 rounded-full p-0 flex items-center justify-center"
                        >
                          {conversation.unread}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="border-b p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={selectedConversation.avatar} />
                      <AvatarFallback>
                        {selectedConversation.name.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">
                        {selectedConversation.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {selectedConversation.isGroup
                          ? `${selectedConversation.participants?.join(", ")}`
                          : "Online"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => togglePin(selectedConversation.id)}
                        >
                          {selectedConversation.isPinned ? "Unpin" : "Pin"}{" "}
                          conversation
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          Search in conversation
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="flex flex-col gap-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === "You" ? "justify-end" : "justify-start"}`}
                    >
                      <div className="flex gap-2 max-w-[80%]">
                        {message.sender !== "You" && (
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${message.sender}`}
                            />
                            <AvatarFallback>
                              {message.sender.substring(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div>
                          {message.sender !== "You" && (
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium">
                                {message.sender}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {message.senderRole}
                              </Badge>
                            </div>
                          )}
                          <div
                            className={`rounded-lg p-3 ${
                              message.sender === "You"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            }`}
                          >
                            {message.isMedia ? (
                              <div className="flex items-center gap-2">
                                {message.mediaType === "image" && (
                                  <Image className="h-4 w-4" />
                                )}
                                {message.mediaType === "pdf" && (
                                  <Paperclip className="h-4 w-4" />
                                )}
                                {message.mediaType === "voice" && (
                                  <Mic className="h-4 w-4" />
                                )}
                                <span>{message.content}</span>
                              </div>
                            ) : (
                              message.content
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {message.timestamp}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="border-t p-4">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Input
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="flex-1"
                  />
                  <Button size="icon" onClick={handleSendMessage}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-4 text-center">
              <Card className="w-[350px]">
                <CardHeader>
                  <CardTitle>Select a conversation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Choose a conversation from the sidebar to start messaging.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatSystem;
