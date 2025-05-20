import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, MapPin, Star, Calendar, Filter, Users } from "lucide-react";

interface Trainer {
  id: string;
  name: string;
  avatar: string;
  specialization: string;
  rating: number;
  location: string;
  experience: number;
  trainings: number;
  availability: "available" | "busy" | "unavailable";
  skills: string[];
}

const Trainers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);

  // Mock trainers data
  const trainers: Trainer[] = [
    {
      id: "TR-01",
      name: "Ahmed Hassan",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed",
      specialization: "Leadership",
      rating: 4.8,
      location: "Cairo",
      experience: 5,
      trainings: 42,
      availability: "available",
      skills: ["Team Building", "Strategic Planning", "Conflict Resolution"],
    },
    {
      id: "TR-02",
      name: "Sara Mohamed",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sara",
      specialization: "Communication",
      rating: 4.9,
      location: "Alexandria",
      experience: 7,
      trainings: 65,
      availability: "busy",
      skills: ["Public Speaking", "Presentation Skills", "Negotiation"],
    },
    {
      id: "TR-03",
      name: "Mohamed Ali",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mohamed",
      specialization: "Project Management",
      rating: 4.7,
      location: "Cairo",
      experience: 6,
      trainings: 38,
      availability: "available",
      skills: ["Agile", "Scrum", "Risk Management", "Budgeting"],
    },
    {
      id: "TR-04",
      name: "Layla Mahmoud",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Layla",
      specialization: "Technical Skills",
      rating: 4.6,
      location: "Giza",
      experience: 4,
      trainings: 29,
      availability: "unavailable",
      skills: ["Web Development", "Data Analysis", "Programming"],
    },
    {
      id: "TR-05",
      name: "Omar Khaled",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Omar",
      specialization: "Soft Skills",
      rating: 4.5,
      location: "Alexandria",
      experience: 3,
      trainings: 24,
      availability: "available",
      skills: ["Emotional Intelligence", "Time Management", "Teamwork"],
    },
  ];

  const getAvailabilityBadge = (availability: string) => {
    switch (availability) {
      case "available":
        return <Badge className="bg-green-500">Available</Badge>;
      case "busy":
        return <Badge variant="secondary">Busy</Badge>;
      case "unavailable":
        return <Badge variant="outline">Unavailable</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const filteredTrainers = trainers.filter(
    (trainer) =>
      trainer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trainer.specialization
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      trainer.location.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Trainers</h1>
          <p className="text-muted-foreground">
            Find and connect with qualified trainers for your sessions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button>
            <Users className="mr-2 h-4 w-4" />
            Request Trainer
          </Button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search trainers by name, specialization, or location..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Left side - List of trainers */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Available Trainers</CardTitle>
              <CardDescription>
                {filteredTrainers.length} trainers found
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="leadership">Leadership</TabsTrigger>
                  <TabsTrigger value="technical">Technical</TabsTrigger>
                  <TabsTrigger value="soft">Soft Skills</TabsTrigger>
                </TabsList>
                <div className="mt-4 space-y-3">
                  {filteredTrainers.map((trainer) => (
                    <div
                      key={trainer.id}
                      className={`cursor-pointer rounded-lg border p-3 transition-colors hover:bg-accent/50 ${selectedTrainer?.id === trainer.id ? "border-primary bg-accent" : ""}`}
                      onClick={() => setSelectedTrainer(trainer)}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={trainer.avatar} />
                          <AvatarFallback>
                            {trainer.name.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium">{trainer.name}</h3>
                            {getAvailabilityBadge(trainer.availability)}
                          </div>
                          <div className="mt-1 flex items-center text-sm text-muted-foreground">
                            <MapPin className="mr-1 h-3 w-3" />
                            {trainer.location}
                            <span className="mx-2">•</span>
                            <Star className="mr-1 h-3 w-3 text-yellow-500" />
                            {trainer.rating}
                          </div>
                        </div>
                      </div>
                      <div className="mt-2">
                        <Badge variant="outline" className="mr-1">
                          {trainer.specialization}
                        </Badge>
                        {trainer.skills.slice(0, 2).map((skill) => (
                          <Badge key={skill} variant="outline" className="mr-1">
                            {skill}
                          </Badge>
                        ))}
                        {trainer.skills.length > 2 && (
                          <Badge variant="outline">
                            +{trainer.skills.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Right side - Trainer details */}
        <div>
          {selectedTrainer ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={selectedTrainer.avatar} />
                      <AvatarFallback>
                        {selectedTrainer.name.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>{selectedTrainer.name}</CardTitle>
                      <CardDescription>
                        {selectedTrainer.specialization} Trainer
                      </CardDescription>
                    </div>
                  </div>
                  {getAvailabilityBadge(selectedTrainer.availability)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="grid grid-cols-3 gap-4 rounded-lg bg-muted p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {selectedTrainer.experience}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Years Exp.
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {selectedTrainer.trainings}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Trainings
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {selectedTrainer.rating}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Rating
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-2 font-medium">Skills & Expertise</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedTrainer.skills.map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-2 font-medium">Location</h3>
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="mr-2 h-4 w-4" />
                      {selectedTrainer.location}
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-2 font-medium">Availability</h3>
                    <div className="grid grid-cols-7 gap-1">
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                        (day) => (
                          <div
                            key={day}
                            className={`rounded-md p-2 text-center text-xs ${Math.random() > 0.3 ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-400"}`}
                          >
                            {day}
                          </div>
                        ),
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1">
                      <Calendar className="mr-2 h-4 w-4" />
                      Request Training
                    </Button>
                    <Button variant="outline" className="flex-1">
                      View Profile
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="flex h-[400px] items-center justify-center">
              <CardContent className="text-center">
                <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">
                  No trainer selected
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Select a trainer from the list to view their details
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Trainers;
