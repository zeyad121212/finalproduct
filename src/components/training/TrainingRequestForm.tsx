import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  MapPin,
  Users,
  Briefcase,
  CheckCircle,
  XCircle,
  Upload,
  Clock,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

// Define the form schema using zod
const formSchema = z.object({
  trainingDate: z.date({
    required_error: "Training date is required",
  }),
  location: z.string().min(3, {
    message: "Location must be at least 3 characters",
  }),
  specialization: z.string({
    required_error: "Please select a specialization",
  }),
  traineeCount: z.string().refine((val) => !isNaN(parseInt(val)), {
    message: "Trainee count must be a number",
  }),
  description: z
    .string()
    .min(10, {
      message: "Description must be at least 10 characters",
    })
    .optional(),
  attachments: z.any().optional(),
});

type UserRole = "DV" | "CC" | "PM" | "SV" | "TR" | "MB";

interface TrainingRequestFormProps {
  userRole?: UserRole;
  requestId?: string;
  initialData?: any;
  onSubmit?: (data: any) => void;
}

const TrainingRequestForm = ({
  userRole = "DV",
  requestId,
  initialData,
  onSubmit,
}: TrainingRequestFormProps) => {
  const [step, setStep] = useState(1);
  const [activeTab, setActiveTab] = useState("create");
  const [requestStatus, setRequestStatus] = useState(
    requestId ? "pending" : "draft",
  );

  // Initialize form with react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      trainingDate: undefined,
      location: "",
      specialization: "",
      traineeCount: "",
      description: "",
      attachments: undefined,
    },
  });

  // Mock specializations
  const specializations = [
    { value: "leadership", label: "Leadership" },
    { value: "communication", label: "Communication" },
    { value: "project-management", label: "Project Management" },
    { value: "technical-skills", label: "Technical Skills" },
    { value: "soft-skills", label: "Soft Skills" },
  ];

  // Mock trainers
  const recommendedTrainers = [
    {
      id: "TR-01",
      name: "Ahmed Hassan",
      specialization: "Leadership",
      rating: 4.8,
      distance: "5km",
    },
    {
      id: "TR-02",
      name: "Sara Ahmed",
      specialization: "Communication",
      rating: 4.9,
      distance: "8km",
    },
    {
      id: "TR-03",
      name: "Mohamed Ali",
      specialization: "Project Management",
      rating: 4.7,
      distance: "12km",
    },
  ];

  // Handle form submission
  const handleFormSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log("Form submitted:", data);

    if (!isOnline && !requestId) {
      toast({
        title: "Cannot submit while offline",
        description:
          "Your request will be saved locally and submitted when you reconnect.",
        variant: "warning",
      });
      // In a real app, we would store this in IndexedDB for later sync
    }

    try {
      // If we're on step 2 as SV, fetch AI recommendations
      if (userRole === "SV" && step === 1) {
        await fetchRecommendedTrainers(data);
      }

      // Submit to API if online
      if (isOnline) {
        if (requestId) {
          await updateTrainingRequest(requestId, {
            ...data,
            status: getNextStatus(),
            updated_by: user?.id,
          });
        } else {
          await createTrainingRequest({
            ...data,
            status: "pending_sv_approval",
            requested_by: user?.id,
            region: user?.region,
            department: user?.department,
          });
        }
      }

      if (onSubmit) {
        onSubmit(data);
      }

      // Update status based on role
      setRequestStatus(getNextStatus());

      // Move to next step if applicable
      if (step < getMaxSteps()) {
        setStep(step + 1);
      }

      toast({
        title: "Request updated",
        description: requestId
          ? "Training request updated successfully"
          : "Training request created successfully",
      });
    } catch (error) {
      console.error("Error submitting training request:", error);
      toast({
        title: "Error",
        description:
          "There was an error processing your request. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Get the next status based on current role
  const getNextStatus = () => {
    if (userRole === "DV") {
      return "pending_sv_approval";
    } else if (userRole === "SV") {
      return "pending_pm_approval";
    } else if (userRole === "PM") {
      return "approved";
    } else if (userRole === "TR") {
      return "completed";
    }
    return requestStatus;
  };

  // Get max steps based on user role
  const getMaxSteps = () => {
    switch (userRole) {
      case "DV":
        return 3;
      case "SV":
        return 2;
      case "PM":
        return 2;
      case "TR":
        return 3;
      default:
        return 1;
    }
  };

  // Get status badge color
  const getStatusBadge = () => {
    switch (requestStatus) {
      case "draft":
        return <Badge variant="outline">Draft</Badge>;
      case "pending_sv_approval":
        return <Badge variant="secondary">Pending Supervisor Approval</Badge>;
      case "pending_pm_approval":
        return (
          <Badge variant="secondary">Pending Program Manager Approval</Badge>
        );
      case "approved":
        return <Badge variant="default">Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  // Render form based on user role and step
  const renderFormContent = () => {
    // DV role - creating training request
    if (userRole === "DV") {
      if (step === 1) {
        return (
          <>
            <FormField
              control={form.control}
              name="trainingDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Training Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Select date</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input placeholder="Enter training location" {...field} />
                      <MapPin className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Enter the full address or click to select on map
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );
      } else if (step === 2) {
        return (
          <>
            <FormField
              control={form.control}
              name="specialization"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specialization</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a specialization" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {specializations.map((spec) => (
                        <SelectItem key={spec.value} value={spec.value}>
                          {spec.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="traineeCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Trainees</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="number"
                        placeholder="Enter number of trainees"
                        {...field}
                      />
                      <Users className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );
      } else if (step === 3) {
        return (
          <>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Details</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter any additional details about the training request"
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">Request Summary</h3>
                {getStatusBadge()}
              </div>
              <div className="bg-muted p-4 rounded-md space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span>
                    {form.getValues().trainingDate
                      ? format(form.getValues().trainingDate, "PPP")
                      : "Not set"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location:</span>
                  <span>{form.getValues().location || "Not set"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Specialization:</span>
                  <span>
                    {specializations.find(
                      (s) => s.value === form.getValues().specialization,
                    )?.label || "Not set"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Trainees:</span>
                  <span>{form.getValues().traineeCount || "Not set"}</span>
                </div>
              </div>
            </div>
          </>
        );
      }
    }

    // SV role - approving and suggesting trainers
    else if (userRole === "SV") {
      if (step === 1) {
        return (
          <>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">Request Details</h3>
                {getStatusBadge()}
              </div>
              <div className="bg-muted p-4 rounded-md space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Requested by:</span>
                  <span>DV-05 (Cairo)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span>
                    {initialData?.trainingDate
                      ? format(initialData.trainingDate, "PPP")
                      : "15 Jun 2023"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location:</span>
                  <span>
                    {initialData?.location || "Cairo University, Giza"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Specialization:</span>
                  <span>{initialData?.specialization || "Leadership"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Trainees:</span>
                  <span>{initialData?.traineeCount || "25"}</span>
                </div>
              </div>
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Approval Comments</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter any comments regarding this request"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );
      } else if (step === 2) {
        return (
          <>
            <div className="space-y-4">
              <h3 className="text-sm font-medium">AI Recommended Trainers</h3>
              <div className="space-y-3">
                {recommendedTrainers.map((trainer) => (
                  <div
                    key={trainer.id}
                    className="flex items-center justify-between border rounded-md p-3"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Briefcase className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{trainer.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {trainer.specialization} • {trainer.rating}★ •{" "}
                          {trainer.distance}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        View Profile
                      </Button>
                      <Button size="sm">Select</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        );
      }
    }

    // PM role - final approval
    else if (userRole === "PM") {
      if (step === 1) {
        return (
          <>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">Request Details</h3>
                {getStatusBadge()}
              </div>
              <div className="bg-muted p-4 rounded-md space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Requested by:</span>
                  <span>DV-05 (Cairo)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span>
                    {initialData?.trainingDate
                      ? format(initialData.trainingDate, "PPP")
                      : "15 Jun 2023"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location:</span>
                  <span>
                    {initialData?.location || "Cairo University, Giza"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Specialization:</span>
                  <span>{initialData?.specialization || "Leadership"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Trainees:</span>
                  <span>{initialData?.traineeCount || "25"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Supervisor:</span>
                  <span>SV-03 (Ahmed)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Suggested Trainer:
                  </span>
                  <span>TR-01 (Ahmed Hassan)</span>
                </div>
              </div>
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Final Approval Comments</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter any comments regarding final approval"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );
      } else if (step === 2) {
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-center p-6">
              <div className="text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold">
                  Training Request Approved
                </h3>
                <p className="text-muted-foreground mt-2">
                  The trainer has been notified and will be assigned to this
                  training.
                </p>
              </div>
            </div>
            <div className="border rounded-md p-4">
              <h4 className="font-medium mb-2">Next Steps</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Training request approved</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Trainer assigned</span>
                </li>
                <li className="flex items-center">
                  <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                  <span>Awaiting training execution</span>
                </li>
                <li className="flex items-center">
                  <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                  <span>Awaiting documentation upload</span>
                </li>
              </ul>
            </div>
          </div>
        );
      }
    }

    // TR role - execution and documentation
    else if (userRole === "TR") {
      if (step === 1) {
        return (
          <>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">Training Assignment</h3>
                <Badge>Assigned to You</Badge>
              </div>
              <div className="bg-muted p-4 rounded-md space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Training ID:</span>
                  <span>TRN-2023-056</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span>
                    {initialData?.trainingDate
                      ? format(initialData.trainingDate, "PPP")
                      : "15 Jun 2023"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time:</span>
                  <span>10:00 AM - 2:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location:</span>
                  <span>
                    {initialData?.location || "Cairo University, Giza"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Specialization:</span>
                  <span>{initialData?.specialization || "Leadership"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Trainees:</span>
                  <span>{initialData?.traineeCount || "25"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Contact Person:</span>
                  <span>DV-05 (Mohamed)</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Training Status</h3>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Preparation</span>
                  <span>Execution</span>
                  <span>Documentation</span>
                </div>
                <Progress value={33} className="h-2" />
              </div>
            </div>
          </>
        );
      } else if (step === 2) {
        return (
          <>
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Training Execution</h3>
              <div className="border rounded-md p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span>Mark training as completed</span>
                  </div>
                  <Button size="sm" variant="outline">
                    Complete
                  </Button>
                </div>
                <Separator />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Execution Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter any notes about the training execution"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </>
        );
      } else if (step === 3) {
        return (
          <>
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Upload Documentation</h3>
              <div className="border rounded-md p-4 space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="border border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm font-medium">Attendance Sheet</p>
                    <p className="text-xs text-muted-foreground mb-2">
                      Upload PDF or Excel file
                    </p>
                    <Button size="sm" variant="outline">
                      Upload File
                    </Button>
                  </div>
                  <div className="border border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm font-medium">Trainee Evaluations</p>
                    <p className="text-xs text-muted-foreground mb-2">
                      Upload evaluation results
                    </p>
                    <Button size="sm" variant="outline">
                      Upload File
                    </Button>
                  </div>
                  <div className="border border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm font-medium">Signature Images</p>
                    <p className="text-xs text-muted-foreground mb-2">
                      Upload signature images
                    </p>
                    <Button size="sm" variant="outline">
                      Upload Images
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      }
    }

    // Default view for other roles
    return (
      <div className="flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-muted-foreground">
            You don't have permission to create or modify training requests.
          </p>
        </div>
      </div>
    );
  };

  // Render navigation buttons
  const renderNavButtons = () => {
    return (
      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={() => setStep(step - 1)}
          disabled={step === 1}
        >
          Previous
        </Button>
        {step < getMaxSteps() ? (
          <Button type="submit">Next</Button>
        ) : (
          <Button type="submit">
            {userRole === "DV"
              ? "Submit Request"
              : userRole === "SV"
                ? "Approve & Suggest Trainer"
                : userRole === "PM"
                  ? "Approve Request"
                  : userRole === "TR"
                    ? "Complete Documentation"
                    : "Submit"}
          </Button>
        )}
      </div>
    );
  };

  // Render approval actions for SV and PM
  const renderApprovalActions = () => {
    if (userRole === "SV" || userRole === "PM") {
      return (
        <div className="flex space-x-2">
          <Button type="button" variant="outline" className="flex-1">
            <XCircle className="h-4 w-4 mr-2" />
            Reject
          </Button>
          <Button type="submit" className="flex-1">
            <CheckCircle className="h-4 w-4 mr-2" />
            Approve
          </Button>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          {userRole === "DV"
            ? "Create Training Request"
            : userRole === "SV"
              ? "Review Training Request"
              : userRole === "PM"
                ? "Approve Training Request"
                : userRole === "TR"
                  ? "Training Assignment"
                  : "Training Request"}
        </CardTitle>
        <CardDescription>
          {userRole === "DV"
            ? "Fill out the form to request a new training session"
            : userRole === "SV"
              ? "Review and suggest trainers for this request"
              : userRole === "PM"
                ? "Review and give final approval for this training"
                : userRole === "TR"
                  ? "Manage your assigned training and upload documentation"
                  : "View training request details"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {userRole === "TR" && (
          <Tabs
            defaultValue={activeTab}
            onValueChange={setActiveTab}
            className="mb-6"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Training Details</TabsTrigger>
              <TabsTrigger value="documentation">Documentation</TabsTrigger>
            </TabsList>
          </Tabs>
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="space-y-6"
          >
            {renderFormContent()}

            {userRole === "SV" || userRole === "PM"
              ? step === 1
                ? renderApprovalActions()
                : renderNavButtons()
              : renderNavButtons()}
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-between border-t p-4">
        <div className="text-xs text-muted-foreground">
          {requestId ? `Request ID: ${requestId}` : "New request"}
        </div>
        <div className="text-xs text-muted-foreground">
          {requestStatus !== "draft" &&
            `Last updated: ${format(new Date(), "dd MMM yyyy, HH:mm")}`}
        </div>
      </CardFooter>
    </Card>
  );
};

export default TrainingRequestForm;
