import { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
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
import { Button } from "../../../components/ui/button";
import { format, addDays, startOfWeek } from "date-fns";
import { useAuthContext } from "../../../context/AuthContext";
import { Navigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

export default function Admin() {
  const [availabilities, setAvailabilities] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [timezone, setTimezone] = useState("Asia/Kolkata");
  const [employees, setEmployees] = useState([]);
  const [shifts, setShifts] = useState([]);

  // State variables for shift creation
  const [shiftDate, setShiftDate] = useState("");
  const [shiftStartTime, setShiftStartTime] = useState("");
  const [shiftEndTime, setShiftEndTime] = useState("");
  const [allAvailability, setAllAvailability] = useState([]);

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/admin/availability/`,
          { withCredentials: true }
        );
        setAllAvailability(response.data);
      } catch (error) {
        toast.error("Failed to fetch availabilities");
      }
    };
    fetchAvailability();
  }, []);

  useEffect(() => {
    const uniqueUsers = allAvailability
      .map((obj) => obj.user) // Extract the user objects
      .reduce((acc, current) => {
        // Use email or _id as a unique identifier
        if (!acc.some((user) => user.email === current.email)) {
          acc.push(current);
        }
        return acc;
      }, []);
    setEmployees(uniqueUsers);
  }, [allAvailability]);

  useEffect(() => {
    if (selectedUser) {
      const userAvailability = allAvailability.filter(
        (availability) => availability.user._id === selectedUser._id
      );
      setAvailabilities(userAvailability);
    } else {
      setAvailabilities([]);
    }
  }, [selectedUser, allAvailability]);

  const handleCreateShift = async (e) => {
    e.preventDefault();
    try {
      console.log({
        employeeId: selectedUser._id,
        date: shiftDate,
        startTime: shiftStartTime,
        endTime: shiftEndTime,
        adminTimezone: timezone,
      });

      const response = await axios.post(
        `http://localhost:8000/api/admin/shifts`,
        {
          employeeId: selectedUser._id,
          date: shiftDate,
          startTime: shiftStartTime,
          endTime: shiftEndTime,
          adminTimezone: timezone,
        },
        { withCredentials: true }
      );

      // Update the shifts state with the new shift
      setShifts([...shifts, response.data]);

      setTimeout(() => {
        window.location.reload();
      }, 2000);

      // Reset form fields after successful submission
      setShiftDate("");
      setShiftStartTime("");
      setShiftEndTime("");
      toast.success("Shift created successfully");
    } catch (error) {
      toast.error("Failed to create shift");
    }
  };

  const weekStart = startOfWeek(new Date());
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const { logout } = useAuthContext();

  const handleLogout = async () => {
    await logout();
    localStorage.removeItem("user");
    <Navigate to="/login" />;
  };

  // Function to convert UTC time to selected timezone
  const convertToTimezone = (date, time, timezone) => {
    const dateTime = new Date(`${date}T${time}`);
    return new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(dateTime);
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <Toaster />
      <Button onClick={handleLogout}>Logout</Button>
      <Card>
        <CardHeader>
          <CardTitle>Employee Availability</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="my-8">
            <Select
              onValueChange={(value) =>
                setSelectedUser(employees.find((emp) => emp._id === value))
              }
              placeholder="Select Employee"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Employee" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((employee) => (
                  <SelectItem key={employee._id} value={employee._id}>
                    {employee.name} - {employee.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="my-8">
            <Select value={timezone} onValueChange={setTimezone}>
              <SelectTrigger>
                <SelectValue placeholder="Select Timezone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Asia/Kolkata">Asia/Kolkata</SelectItem>
                <SelectItem value="America/Toronto">America/Toronto</SelectItem>
                <SelectItem value="America/Los_Angeles">
                  America/Los_Angeles
                </SelectItem>
                <SelectItem value="Asia/Tokyo">Asia/Tokyo</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
                          {convertToTimezone(a.date, a.startTime, timezone)} -{" "}
                          {convertToTimezone(a.date, a.endTime, timezone)} (
                          {timezone})
                        </div>
                      ))}
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Create Shift</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateShift} className="space-y-4">
            <div className="space-y-2">
              <label className="mx-4">Date</label>
              <input
                type="date"
                className="input"
                value={shiftDate}
                onChange={(e) => setShiftDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="mx-4">Start Time</label>
              <input
                type="time"
                className="input"
                value={shiftStartTime}
                onChange={(e) => setShiftStartTime(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="mx-4">End Time</label>
              <input
                type="time"
                className="input"
                value={shiftEndTime}
                onChange={(e) => setShiftEndTime(e.target.value)}
                required
              />
            </div>
            <Button type="submit">Create Shift</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
