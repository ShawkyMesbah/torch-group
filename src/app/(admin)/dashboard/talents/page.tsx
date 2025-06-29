"use client";

import { useState } from "react";
import { Plus, Search } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UnifiedLoading } from "@/components/loading/UnifiedLoading";
import { useTalents } from "@/hooks/use-talents";

export default function TalentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { talents, isLoading, error } = useTalents();

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-lg bg-red-500/10 p-4 text-red-500">
          Error loading talents. Please try again later.
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <UnifiedLoading />;
  }

  const filteredTalents = talents?.filter((talent) =>
    talent.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Talents</h1>
        <Link href="/dashboard/talents/new">
          <Button className="bg-red-500 hover:bg-red-600">
            <Plus className="h-4 w-4 mr-2" />
            Add New Talent
          </Button>
        </Link>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search talents..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm bg-gray-900 border-gray-800"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredTalents?.map((talent) => (
          <Link
            key={talent.id}
            href={`/dashboard/talents/${talent.id}`}
            className="block p-4 rounded-lg bg-gray-900 hover:bg-gray-800 transition"
          >
            <div className="flex items-center gap-3">
              {talent.imageUrl && (
                <img
                  src={talent.imageUrl}
                  alt={talent.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
              )}
              <div>
                <h3 className="font-medium text-white">{talent.name}</h3>
                <p className="text-sm text-gray-400">{talent.role}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredTalents?.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-400">No talents found</p>
        </div>
      )}
    </div>
  );
} 