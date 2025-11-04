import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Helmet } from "react-helmet-async";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  thumbnail: string | null;
  content: string;
  category: string;
  created_at: string;
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;

      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();

      if (error) {
        console.error("Error fetching post:", error);
        navigate("/blog");
      } else if (!data) {
        navigate("/blog");
      } else {
        setPost(data);
      }
      setLoading(false);
    };

    fetchPost();
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">로딩 중...</p>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>{post.title} | 청약가점계산기 블로그</title>
        <meta name="description" content={post.excerpt} />
        <link rel="canonical" href={`https://cheongvyak.lovable.app/blog/${post.slug}`} />
        <meta property="og:title" content={`${post.title} | 청약가점계산기 블로그`} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:url" content={`https://cheongvyak.lovable.app/blog/${post.slug}`} />
        {post.thumbnail && <meta property="og:image" content={post.thumbnail} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${post.title} | 청약가점계산기 블로그`} />
        <meta name="twitter:description" content={post.excerpt} />
        {post.thumbnail && <meta name="twitter:image" content={post.thumbnail} />}
      </Helmet>

      <div className="min-h-screen bg-background">
        <article className="container mx-auto px-4 py-12 max-w-4xl">
          {/* Navigation */}
          <Link to="/blog">
            <Button variant="ghost" className="mb-8">
              <ArrowLeft className="mr-2 h-4 w-4" />
              목록으로
            </Button>
          </Link>

          {/* Header */}
          <header className="mb-8">
            <Badge className="mb-4">{post.category}</Badge>
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <time dateTime={post.created_at}>
                {format(new Date(post.created_at), "PPP", { locale: ko })}
              </time>
            </div>
          </header>

          {/* Thumbnail */}
          {post.thumbnail && (
            <div className="mb-8 rounded-lg overflow-hidden">
              <img
                src={post.thumbnail}
                alt={post.title}
                className="w-full h-auto object-cover"
              />
            </div>
          )}

          {/* Content */}
          <Card>
            <CardContent className="prose prose-lg max-w-none p-8">
              <div
                dangerouslySetInnerHTML={{ __html: post.content }}
                className="whitespace-pre-wrap"
              />
            </CardContent>
          </Card>

          {/* CTA */}
          <Card className="mt-12 bg-primary/5 border-primary/20">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">내 청약가점 계산하기</h2>
              <p className="text-muted-foreground mb-6">
                지금 바로 내 청약가점을 확인해보세요!
              </p>
              <Link to="/">
                <Button size="lg">계산하러 가기</Button>
              </Link>
            </CardContent>
          </Card>
        </article>
      </div>
    </>
  );
};

export default BlogPost;
