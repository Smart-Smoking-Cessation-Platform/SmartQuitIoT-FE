import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Clock,
  User,
  UserCheck,
  Video,
  ExternalLink,
  Star,
  Hash,
  Globe,
  Clock3,
} from "lucide-react";
import {
  formatDate,
  formatDateTime,
  formatTime,
  formatTimeAgo,
} from "@/utils/formatDate";
import { useNavigate } from "react-router-dom";

const InfoRow = ({ icon: Icon, label, value, className = "" }) => (
  <div className={`flex items-center gap-3 ${className}`}>
    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50">
      <Icon className="w-4 h-4 text-blue-600" />
    </div>
    <div className="flex-1">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="font-medium">{value || "N/A"}</div>
    </div>
  </div>
);

const AppointmentDetailModal = ({ isOpen, onOpenChange, appointment }) => {
  if (!appointment) return null;

  const {
    appointmentId,
    coachId,
    coachName,
    memberId,
    memberName,
    slotId,
    date,
    startTime,
    endTime,
    channelName,
    meetingUrl,
    joinWindowStart,
    joinWindowEnd,
    hasRated,
  } = appointment;
  const nav = useNavigate();

  const duration =
    startTime && endTime
      ? (() => {
          const start = new Date(`2000-01-01T${startTime}`);
          const end = new Date(`2000-01-01T${endTime}`);
          const diffMinutes = (end - start) / (1000 * 60);
          return `${diffMinutes} minutes`;
        })()
      : "N/A";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Appointment Details
            <Badge variant="outline" className="ml-auto">
              ID: {appointmentId || "N/A"}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Comprehensive information about the scheduled appointment
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Participants */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-emerald-600" />
                  Coach Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div
                  className="font-medium text-lg cursor-pointer"
                  onClick={() => nav(`/admin/manage-coaches/${coachId}`)}
                >
                  {coachName || "N/A"}
                </div>
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  <Hash className="h-3 w-3" />
                  ID: {coachId || "N/A"}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <User className="h-4 w-4 text-blue-600" />
                  Member Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div
                  className="font-medium text-lg cursor-pointer"
                  onClick={() => nav(`/admin/manage-members/${memberId}`)}
                >
                  {memberName || "N/A"}
                </div>
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  <Hash className="h-3 w-3" />
                  ID: {memberId || "N/A"}
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Schedule Information */}
          <div>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-600" />
              Schedule Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoRow icon={Calendar} label="Date" value={formatDate(date)} />
              <InfoRow icon={Hash} label="Slot ID" value={slotId} />
              <InfoRow
                icon={Clock}
                label="Start Time"
                value={formatTimeAgo(startTime)}
              />
              <InfoRow
                icon={Clock}
                label="End Time"
                value={formatTime(endTime)}
              />
              <InfoRow
                icon={Clock3}
                label="Duration"
                value={duration}
                className="md:col-span-2"
              />
            </div>
          </div>

          <Separator />

          {/* Meeting Information */}
          <div>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Video className="h-4 w-4 text-purple-600" />
              Meeting Information
            </h3>
            <div className="space-y-4">
              <InfoRow icon={Globe} label="Channel Name" value={channelName} />

              {meetingUrl && (
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-50">
                    <Video className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-muted-foreground">
                      Meeting URL
                    </div>
                    <Button
                      variant="link"
                      className="p-0 h-auto font-medium text-left justify-start"
                      onClick={() => window.open(meetingUrl, "_blank")}
                    >
                      {meetingUrl}
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">
                    Join Window Start
                  </div>
                  <div className="text-sm font-medium">
                    {formatDateTime(joinWindowStart)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">
                    Join Window End
                  </div>
                  <div className="text-sm font-medium">
                    {formatDateTime(joinWindowEnd)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Status Information */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-amber-500" />
              <span className="font-medium">Rating Status</span>
            </div>
            <Badge variant={hasRated ? "default" : "secondary"}>
              {hasRated ? "Rated" : "Not Rated"}
            </Badge>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentDetailModal;
