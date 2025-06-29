import { formatDistanceToNow } from 'date-fns';
import { FileText, MessageSquare, Star } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { cn } from '@/lib/utils';

interface RecentPost {
  id: string;
  title: string;
  publishedAt: Date | null;
  author: {
    name: string | null;
  } | null;
}

interface RecentMessage {
  id: string;
  subject: string;
  createdAt: Date;
  name: string;
}

interface RecentTalent {
  id: string;
  name: string;
  createdAt: Date;
  role: string;
}

async function getRecentActivity() {
  const [recentPosts, recentMessages, recentTalents] = await Promise.all([
    prisma.blogPost.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: 'desc' },
      take: 3,
      select: {
        id: true,
        title: true,
        publishedAt: true,
        author: {
          select: {
            name: true
          }
        }
      }
    }),
    prisma.contactMessage.findMany({
      where: { isRead: false },
      orderBy: { createdAt: 'desc' },
      take: 3,
      select: {
        id: true,
        subject: true,
        createdAt: true,
        name: true
      }
    }),
    prisma.talent.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { createdAt: 'desc' },
      take: 3,
      select: {
        id: true,
        name: true,
        createdAt: true,
        role: true
      }
    })
  ]) as [RecentPost[], RecentMessage[], RecentTalent[]];

  return {
    recentPosts,
    recentMessages,
    recentTalents
  };
}

export async function RecentActivity() {
  const { recentPosts, recentMessages, recentTalents } = await getRecentActivity();

  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-6">Recent Activity</h2>
      <div className="space-y-4">
        {recentPosts.map((post: RecentPost) => (
          <div key={post.id} className={cn(
            "flex items-start space-x-3 p-3 rounded-lg",
            "bg-[#1e2943] border border-gray-800"
          )}>
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <FileText className="w-4 h-4 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">{post.title}</p>
              <p className="text-xs text-gray-400">
                Published by {post.author?.name} • {post.publishedAt && formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true })}
              </p>
            </div>
          </div>
        ))}

        {recentMessages.map((message: RecentMessage) => (
          <div key={message.id} className={cn(
            "flex items-start space-x-3 p-3 rounded-lg",
            "bg-[#1e2943] border border-gray-800"
          )}>
            <div className="p-2 bg-yellow-500/10 rounded-lg">
              <MessageSquare className="w-4 h-4 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">{message.subject}</p>
              <p className="text-xs text-gray-400">
                From {message.name} • {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
        ))}

        {recentTalents.map((talent: RecentTalent) => (
          <div key={talent.id} className={cn(
            "flex items-start space-x-3 p-3 rounded-lg",
            "bg-[#1e2943] border border-gray-800"
          )}>
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Star className="w-4 h-4 text-purple-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">{talent.name}</p>
              <p className="text-xs text-gray-400">
                {talent.role} • {formatDistanceToNow(new Date(talent.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
        ))}

        {recentPosts.length === 0 && recentMessages.length === 0 && recentTalents.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            No recent activity to display
          </div>
        )}
      </div>
    </div>
  );
} 