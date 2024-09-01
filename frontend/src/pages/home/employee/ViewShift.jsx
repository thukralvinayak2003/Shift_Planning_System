import { format } from "date-fns-tz";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ViewShift() {
  const [shifts, setShifts] = useState([]);

  useEffect(() => {
    const fetchShifts = async () => {
      const response = await axios.get(
        `http://localhost:8000/api/employee/shifts`,
        {
          withCredentials: true,
        }
      );
      setShifts(response.data);
    };
    fetchShifts();
  }, []);

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Your Assigned Shifts</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {shifts.map((shift, index) => (
            <li key={index} className="border-b pb-4 last:border-b-0 last:pb-0">
              <h3 className="text-lg font-semibold mb-2">
                {format(new Date(shift.date), "EEEE, MMMM d, yyyy")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-muted-foreground mb-1">
                    Admin Timezone ({`${shift.adminTimezone}`})
                  </h4>
                  <p>
                    From {`${shift.startTime}`} to {`${shift.endTime}`}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-muted-foreground mb-1">
                    Your Timezone ({`${shift.employeeTimezone}`})
                  </h4>
                  <p>
                    From {`${shift.startTimeInEmployeeTimezone}`} to{" "}
                    {`${shift.endTimeInEmployeeTimezone}`}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
      <div className="m-5 font-bold">
        <Link to="/">Home</Link>
      </div>
    </Card>
  );
}
