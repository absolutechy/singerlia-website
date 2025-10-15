import React, { useState } from "react";
import { useNavigate } from "react-router";
import AuthModalLayout from "@/components/auth/AuthModalLayout";
import LogoBadge from "@/components/auth/LogoBadge";
import SelectableCard from "@/components/auth/SelectableCard";
import { Button } from "@/components/common";
import { Mic2, Users } from "lucide-react";

type RoleOption = "artist" | "customer";

const roleOptions = [
  {
    id: "artist" as RoleOption,
    title: "I am an Artist",
    icon: <Mic2 className="h-7 w-7" />,
  },
  {
    id: "customer" as RoleOption,
    title: "I am a Customer",
    icon: <Users className="h-7 w-7" />,
  },
];

const ChooseRole: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<RoleOption | null>(null);
  const navigate = useNavigate();

  return (
    <AuthModalLayout title="Choose Role">
      <div className="space-y-8">
        <LogoBadge size="md" />
        <div className="grid gap-4 md:grid-cols-2">
          {roleOptions.map((option) => (
            <SelectableCard
              key={option.id}
              title={option.title}
              icon={option.icon}
              selected={selectedRole === option.id}
              onClick={() => setSelectedRole(option.id)}
            />
          ))}
        </div>
        <Button
          variant="secondary"
          size="large"
          className="mx-auto w-full max-w-sm rounded-full bg-[#371552] text-white hover:bg-[#4A1F6B]"
          disabled={!selectedRole}
          onClick={() => {
            if (!selectedRole) return;
            navigate("/auth/login");
          }}
        >
          <span className="font-semibold">
            {selectedRole ? "Continue" : "Continue"}
          </span>
        </Button>
      </div>
    </AuthModalLayout>
  );
};

export default ChooseRole;
