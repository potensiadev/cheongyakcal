import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Helmet } from "react-helmet-async";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  thumbnail: string | null;
  category: string;
  created_at: string;
}

const Blog = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching posts:", error);
      } else {
        setPosts(data || []);
      }
      setLoading(false);
    };

    fetchPosts();
  }, []);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(posts.length / postsPerPage);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">로딩 중...</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>청약가점계산기 블로그 | 아파트 청약 꿀팁 & 최신 정보</title>
        <meta
          name="description"
          content="청약가점 계산법부터 신혼부부, 무주택자 가점 노하우까지 한눈에!"
        />
        <link rel="canonical" href="https://cheongvyak.lovable.app/blog" />
        <meta property="og:title" content="청약가점계산기 블로그 | 아파트 청약 꿀팁 & 최신 정보" />
        <meta property="og:description" content="청약가점 계산법부터 신혼부부, 무주택자 가점 노하우까지 한눈에!" />
        <meta property="og:url" content="https://cheongvyak.lovable.app/blog" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <Link to="/">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                계산기로 돌아가기
              </Button>
            </Link>
            <h1 className="text-4xl font-bold mb-2">청약가점계산기 블로그</h1>
            <p className="text-muted-foreground text-lg">
              아파트 청약 꿀팁과 최신 정보를 확인하세요
            </p>
          </div>

          {/* Posts Grid */}
          {currentPosts.length === 0 ? (
            <Card className="text-center p-12">
              <p className="text-muted-foreground">아직 게시글이 없습니다.</p>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {currentPosts.map((post) => (
                  <Link key={post.id} to={`/blog/${post.slug}`} className="group">
                    <Card className="h-full transition-all hover:shadow-lg hover:scale-[1.02]">
                      {post.thumbnail && (
                        <div className="relative overflow-hidden rounded-t-lg">
                          <img
                            src={post.thumbnail}
                            alt={post.title}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                          />
                          <Badge className="absolute top-4 left-4 bg-primary">
                            {post.category}
                          </Badge>
                        </div>
                      )}
                      <CardHeader>
                        <CardTitle className="group-hover:text-primary transition-colors">
                          {post.title}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(post.created_at), "PPP", { locale: ko })}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      onClick={() => setCurrentPage(page)}
                      className="min-w-[40px]"
                    >
                      {page}
                    </Button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Blog;
