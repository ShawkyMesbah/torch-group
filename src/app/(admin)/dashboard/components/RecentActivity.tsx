import { formatDistanceToNow } from 'date-fns';
import { FileText, MessageSquare, Star } from 'lucide-react';
import prisma from '@/lib/prisma';

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
    <div className="bg-white rounded-lg shadow-sm p-comfortable border border-torch-border">
      <h2 className="text-lg font-medium text-torch-text mb-4">Recent Activity</h2>
      <div className="space-y-4">
        {recentPosts.map((post: RecentPost) => (
          <div key={post.id} className="flex items-start space-x-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <FileText className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-torch-text">{post.title}</p>
              <p className="text-xs text-torch-text-light">
                Published by {post.author?.name} • {post.publishedAt && formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true })}
              </p>
            </div>
          </div>
        ))}

        {recentMessages.map((message: RecentMessage) => (
          <div key={message.id} className="flex items-start space-x-3">
            <div className="p-2 bg-yellow-100 rounded-full">
              <MessageSquare className="w-4 h-4 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-torch-text">{message.subject}</p>
              <p className="text-xs text-torch-text-light">
                From {message.name} • {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
        ))}

        {recentTalents.map((talent: RecentTalent) => (
          <div key={talent.id} className="flex items-start space-x-3">
            <div className="p-2 bg-purple-100 rounded-full">
              <Star className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-torch-text">{talent.name}</p>
              <p className="text-xs text-torch-text-light">
                {talent.role} • {formatDistanceToNow(new Date(talent.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 