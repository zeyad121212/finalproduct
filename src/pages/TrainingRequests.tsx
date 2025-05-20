import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus, Filter } from "lucide-react";
import TrainingRequestForm from "@/components/training/TrainingRequestForm";

const TrainingRequests = () => {
  const [showNewRequestForm, setShowNewRequestForm] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);

  // Mock user role - in a real app, this would come from auth context
  const userRole = "DV";

  // Mock training requests
  const requests = [
    {
      id: "TRN-2023-001",
      title: "Leadership Workshop",
      location: "Cairo HQ",
      date: "2023-06-15",
      status: "pending_sv_approval",
      trainees: 20,
    },
    {
      id: "TRN-2023-002",
      title: "Communication Skills",
      location: "Alexandria Branch",
      date: "2023-06-22",
      status: "approved",
      trainees: 15,
    },
    {
      id: "TRN-2023-003",
      title: "Project Management",
      location: "Cairo University",
      date: "2023-07-05",
      status: "completed",
      trainees: 25,
    },
    {
      id: "TRN-2023-004",
      title: "Technical Training",
      location: "Online",
      date: "2023-07-12",
      status: "rejected",
      trainees: 30,
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending_sv_approval":
        return <Badge variant="secondary">Pending Supervisor</Badge>;
      case "pending_pm_approval":
        return <Badge variant="secondary">Pending Manager</Badge>;
      case "approved":
        return <Badge variant="default">Approved</Badge>;
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handleNewRequest = () => {
    setShowNewRequestForm(true);
    setSelectedRequest(null);
  };

  const handleSelectRequest = (id: string) => {
    setSelectedRequest(id);
    setShowNewRequestForm(false);
  };

  const handleFormSubmit = (data: any) => {
    console.log("Form submitted:", data);
    // In a real app, this would send the data to an API
    setShowNewRequestForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Training Requests
          </h1>
          <p className="text-muted-foreground">
            Create and manage training requests for your team.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleNewRequest}>
            <Plus className="mr-2 h-4 w-4" />
            New Request
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Left side - List of requests */}
        <div>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Your Requests</CardTitle>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </div>
              <CardDescription>
                View and track all your training requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="approved">Approved</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>
                <div className="mt-4 space-y-3">
                  {requests.map((request) => (
                    <div
                      key={request.id}
                      className={`cursor-pointer rounded-lg border p-3 transition-colors hover:bg-accent/50 ${selectedRequest === request.id ? "border-primary bg-accent" : ""}`}
                      onClick={() => handleSelectRequest(request.id)}
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{request.title}</h3>
                        {getStatusBadge(request.status)}
                      </div>
                      <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          {request.id}
                        </div>
                        <div>{new Date(request.date).toLocaleDateString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Right side - Request form or details */}
        <div>
          {showNewRequestForm ? (
            <TrainingRequestForm
              userRole={userRole}
              onSubmit={handleFormSubmit}
            />
          ) : selectedRequest ? (
            <TrainingRequestForm
              userRole={userRole}
              requestId={selectedRequest}
              initialData={requests.find((r) => r.id === selectedRequest)}
              onSubmit={handleFormSubmit}
            />
          ) : (
            <Card className="flex h-[400px] items-center justify-center">
              <CardContent className="text-center">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">
                  No request selected
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Select a request from the list or create a new one
                </p>
                <Button className="mt-4" onClick={handleNewRequest}>
                  <Plus className="mr-2 h-4 w-4" />
                  New Request
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainingRequests;
