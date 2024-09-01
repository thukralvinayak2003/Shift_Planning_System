import { useEffect, useState } from "react";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { format, addDays, startOfWeek, differenceInHours } from "date-fns";
import { useAuthContext } from "../../../context/AuthContext.jsx";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function Employee() {
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [timezone, setTimezone] = useState("");
  const [availabilities, setAvailabilities] = useState([]);
  const [error, setError] = useState("");

  const { logout } = useAuthContext();

  const handleLogout = async () => {
    await logout();
    localStorage.removeItem("user");
    <Navigate to="/login" />;
  };

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const availability = await axios.get(
          `http://localhost:8000/api/employee/availability/`,
          {
            withCredentials: true,
          }
        );
        setAvailabilities(availability.data);
      } catch (error) {
        toast.error("Can't get availability");
      }
    };
    fetchAvailability();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const start = new Date(`${date}T${startTime}`);
    const end = new Date(`${date}T${endTime}`);
    const duration = Math.abs(differenceInHours(end, start));

    console.log(duration);
    if (duration < 4) {
      setError("Availability must be for at least four hours daily");
      return;
    }
    try {
      await axios.post(
        `http://localhost:8000/api/employee/availability/`,
        {
          date,
          startTime,
          endTime,
          timezone,
        },
        {
          withCredentials: true,
        }
      );
      const newAvailability = { date, startTime, endTime, timezone };
      setAvailabilities([...availabilities, newAvailability]);

      // Reset form
      setDate("");
      setStartTime("");
      setEndTime("");
    } catch (error) {
      toast.error("Failed posting availability, Check date");
    }
  };

  const weekStart = startOfWeek(new Date());
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <div className="container mx-auto p-4 space-y-8">
      <Toaster />
      <Button onClick={handleLogout}>Logout</Button>
      <Card>
        <CardHeader>
          <CardTitle>Create Availability</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select value={timezone} onValueChange={setTimezone} required>
                  <SelectTrigger id="timezone">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Asia/Kolkata">Asia/Kolkata</SelectItem>
                    <SelectItem value="America/Toronto">
                      America/Toronto
                    </SelectItem>
                    <SelectItem value="America/Los_Angeles">
                      America/Los_Angeles
                    </SelectItem>
                    <SelectItem value="Asia/Tokyo">Asia/Tokyo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                />
              </div>
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <Button type="submit">Create Availability</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Availability</CardTitle>
          <p className="text-sm text-muted-foreground">Timezone: {timezone}</p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                {weekDays.map((day) => (
                  <TableHead key={day.toISOString()}>
                    {format(day, "EEEE")}
                    <br />
                    {format(day, "MM/dd/yyyy")}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                {weekDays.map((day) => (
                  <TableCell key={day.toISOString()}>
                    {availabilities
                      .filter((a) => a.date === format(day, "yyyy-MM-dd"))
                      .map((a, index) => (
                        <div key={index}>
                          {a.startTime} - {a.endTime}
                        </div>
                      ))}
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
        <div className="m-5  -mt-5">
          <Link to="/shifts">Check Shifts</Link>
        </div>
      </Card>
    </div>
  );
}
