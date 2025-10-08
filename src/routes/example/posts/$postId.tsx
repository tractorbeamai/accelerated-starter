import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTRPC } from "@/trpc/react";

export const Route = createFileRoute("/example/posts/$postId")({
  component: PostDetail,
});

function PostDetail() {
  const trpc = useTRPC();
  const { postId } = Route.useParams();
  const { data: post, isLoading } = useQuery(
    trpc.posts.byId.queryOptions(+postId),
  );

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-muted-foreground text-center">Loading...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Post Not Found</CardTitle>
            <CardDescription>
              The post you're looking for doesn't exist.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link to="/example/posts">Back to Posts</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-4">
        <Button variant="ghost" asChild>
          <Link to="/example/posts">&larr; Back to Posts</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-3xl">{post.title}</CardTitle>
              <CardDescription>
                Created on{" "}
                {new Date(post.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </CardDescription>
            </div>
            <Badge
              variant={post.status === "published" ? "default" : "secondary"}
            >
              {post.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-muted-foreground mb-2 text-sm font-medium">
              Content
            </h3>
            <p className="text-foreground whitespace-pre-wrap">
              {post.content}
            </p>
          </div>

          <div className="text-muted-foreground flex items-center gap-4 border-t pt-6 text-sm">
            <div>
              <span className="font-medium">Created:</span>{" "}
              {new Date(post.createdAt).toLocaleString()}
            </div>
            <div>
              <span className="font-medium">Updated:</span>{" "}
              {new Date(post.updatedAt).toLocaleString()}
            </div>
          </div>

          <div className="flex gap-2 border-t pt-6">
            <Button variant="outline">Edit</Button>
            <Button variant="outline">Delete</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
