// src/pages/coach/ProfileSettingPage.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  getAuthenticatedCoach,
  updateCoachProfile,
} from "@/services/coachService";
import { uploadUnsigned } from "@/services/uploadService";
import useToast from "@/hooks/useToast";
import { Save, Upload, User, FileText, Award, Briefcase } from "lucide-react";
import CircleLoading from "@/components/loadings/CircleLoading";

const ProfileSettingPage = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [coachData, setCoachData] = useState(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCertificate, setUploadingCertificate] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      avatarUrl: "",
      certificateUrl: "",
      bio: "",
      experienceYears: 0,
      specializations: "",
    },
  });

  const avatarUrl = watch("avatarUrl");
  const certificateUrl = watch("certificateUrl");

  const fetchCoachProfile = useCallback(async () => {
    setFetching(true);
    try {
      const response = await getAuthenticatedCoach();
      if (response?.status === 200) {
        const data = response.data;
        setCoachData(data);
        setValue("firstName", data.firstName || "");
        setValue("lastName", data.lastName || "");
        setValue("avatarUrl", data.avatarUrl || "");
        setValue("certificateUrl", data.certificateUrl || "");
        setValue("bio", data.bio || "");
        setValue("experienceYears", data.experienceYears || 0);
        setValue("specializations", data.specializations || "");
      }
    } catch (error) {
      console.error("Failed to fetch coach profile:", error);
      toast.error("Failed to load profile. Please try again.");
    } finally {
      setFetching(false);
    }
  }, [setValue, toast]);

  useEffect(() => {
    fetchCoachProfile();
  }, [fetchCoachProfile]);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    try {
      const result = await uploadUnsigned(file, { folder: "coaches/avatars" });
      setValue("avatarUrl", result.secure_url);
      toast.success("Avatar uploaded successfully");
    } catch (error) {
      console.error("Avatar upload failed:", error);
      toast.error("Failed to upload avatar. Please try again.");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleCertificateUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCertificate(true);
    try {
      const result = await uploadUnsigned(file, {
        folder: "coaches/certificates",
      });
      setValue("certificateUrl", result.secure_url);
      toast.success("Certificate uploaded successfully");
    } catch (error) {
      console.error("Certificate upload failed:", error);
      toast.error("Failed to upload certificate. Please try again.");
    } finally {
      setUploadingCertificate(false);
    }
  };

  const onSubmit = async (data) => {
    if (!coachData?.id) {
      toast.error("Coach ID not found");
      return;
    }

    setLoading(true);
    try {
      const response = await updateCoachProfile(coachData.id, {
        firstName: data.firstName,
        lastName: data.lastName,
        avatarUrl: data.avatarUrl || null,
        certificateUrl: data.certificateUrl || null,
        bio: data.bio || null,
        experienceYears: parseInt(data.experienceYears) || 0,
        specializations: data.specializations || null,
      });

      if (response?.status === 200) {
        toast.success("Profile updated successfully");
        // Refresh profile data
        await fetchCoachProfile();
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      const errorMessage =
        error?.response?.data?.message || "Failed to update profile";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <CircleLoading />
      </div>
    );
  }

  return (
    <div className="px-10 min-h-screen">
      <div className="max-w-8xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Profile Settings
          </h1>
          <p className="text-gray-600">
            Manage your profile information and preferences
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - 2 Cards stacked vertically */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information Card */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-emerald-600" />
                    <CardTitle>Personal Information</CardTitle>
                  </div>
                  <CardDescription>
                    Update your personal details and profile picture
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar Upload */}
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className="relative">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-emerald-100 bg-gray-100">
                          {avatarUrl ? (
                            <img
                              src={avatarUrl}
                              alt="Avatar"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-400 to-teal-500 text-white text-3xl font-bold">
                              {coachData?.firstName?.charAt(0) ||
                                coachData?.lastName?.charAt(0) ||
                                "C"}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <Label htmlFor="avatar-upload" className="mb-2 block">
                        Profile Picture
                      </Label>
                      <div className="flex items-center gap-3">
                        <label
                          htmlFor="avatar-upload"
                          className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                        >
                          <Upload className="w-4 h-4" />
                          {uploadingAvatar ? "Uploading..." : "Upload Avatar"}
                        </label>
                        <input
                          id="avatar-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          className="hidden"
                          disabled={uploadingAvatar}
                        />
                        {avatarUrl && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setValue("avatarUrl", "")}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        Recommended: Square image, at least 400x400px
                      </p>
                    </div>
                  </div>

                  {/* Name Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">
                        First Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="firstName"
                        placeholder="Enter first name"
                        {...register("firstName", {
                          required: "First name is required",
                        })}
                        className={errors.firstName ? "border-red-500" : ""}
                      />
                      {errors.firstName && (
                        <p className="text-sm text-red-500">
                          {errors.firstName.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName">
                        Last Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="lastName"
                        placeholder="Enter last name"
                        {...register("lastName", {
                          required: "Last name is required",
                        })}
                        className={errors.lastName ? "border-red-500" : ""}
                      />
                      {errors.lastName && (
                        <p className="text-sm text-red-500">
                          {errors.lastName.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Email (Read-only) */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={coachData?.email || ""}
                      disabled
                      className="bg-gray-50"
                    />
                    <p className="text-sm text-gray-500">
                      Email cannot be changed
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Professional Information Card */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-emerald-600" />
                    <CardTitle>Professional Information</CardTitle>
                  </div>
                  <CardDescription>
                    Update your professional credentials and experience
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Experience Years */}
                  <div className="space-y-2">
                    <Label htmlFor="experienceYears">
                      Years of Experience{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="experienceYears"
                      type="number"
                      min="0"
                      placeholder="Enter years of experience"
                      {...register("experienceYears", {
                        required: "Experience years is required",
                        min: {
                          value: 0,
                          message: "Experience years must be 0 or greater",
                        },
                        valueAsNumber: true,
                      })}
                      className={errors.experienceYears ? "border-red-500" : ""}
                    />
                    {errors.experienceYears && (
                      <p className="text-sm text-red-500">
                        {errors.experienceYears.message}
                      </p>
                    )}
                  </div>

                  {/* Specializations */}
                  <div className="space-y-2">
                    <Label htmlFor="specializations">Specializations</Label>
                    <Input
                      id="specializations"
                      placeholder="e.g., Smoking Cessation, Behavioral Therapy"
                      {...register("specializations")}
                    />
                    <p className="text-sm text-gray-500">
                      List your areas of expertise
                    </p>
                  </div>

                  {/* Bio */}
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell us about yourself, your background, and your approach to coaching..."
                      rows={6}
                      {...register("bio")}
                    />
                    <p className="text-sm text-gray-500">
                      A brief description about yourself and your coaching style
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Certificate Card */}
            <div className="lg:col-span-1">
              <Card className="h-full flex flex-col">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-emerald-600" />
                    <CardTitle>Certificates</CardTitle>
                  </div>
                  <CardDescription>
                    Upload your professional certificates
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 flex-1 flex flex-col">
                  <div className="space-y-2 flex-1">
                    <Label htmlFor="certificate-upload">Certificate</Label>
                    <div className="flex flex-col gap-3">
                      <label
                        htmlFor="certificate-upload"
                        className="cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                      >
                        <Upload className="w-4 h-4" />
                        {uploadingCertificate
                          ? "Uploading..."
                          : "Upload Certificate"}
                      </label>
                      <input
                        id="certificate-upload"
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleCertificateUpload}
                        className="hidden"
                        disabled={uploadingCertificate}
                      />
                      {certificateUrl && (
                        <>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setValue("certificateUrl", "")}
                          >
                            Remove
                          </Button>
                          <a
                            href={certificateUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-emerald-600 hover:underline flex items-center gap-1"
                          >
                            <FileText className="w-4 h-4" />
                            View Certificate
                          </a>
                        </>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Upload your professional certification documents
                    </p>
                  </div>

                  {/* Submit Button - Fixed at bottom */}
                  <div className="mt-auto pt-4 border-t">
                    <Button
                      type="submit"
                      disabled={
                        loading || uploadingAvatar || uploadingCertificate
                      }
                      className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Saving...
                        </span>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileSettingPage;
