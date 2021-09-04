import { GetStaticPaths, GetStaticProps } from "next";
import { useSession } from "next-auth/client";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { RichText } from "prismic-dom";
import { useEffect } from "react";

import { getPrismicClient } from "../../../services/prismic";

import styled from '../post.module.scss'

interface PostProps {
    post: {
        slug: string;
        title: string;
        content: string;
        updatedAt: string;
    }
}

export default function Post({ post }: PostProps) {
    const [session] = useSession()
    const router = useRouter()

    useEffect(() => {
        if(session?.activeSubscription) {
            router.push(`/post/${post.slug}`)
        }
    }, [session])
    return (
        <>
            <Head>
                <title>{post.title} | ignews</title>
            </Head>

            <main className={styled.container}>
                <article className={styled.post}>
                    <h1>{post.title}</h1>
                    <time>{post.updatedAt}</time>

                    <div 
                        className={`${styled.postContent} ${styled.previewContent}`}
                        dangerouslySetInnerHTML={{ __html: post.content }} 
                    />

                    <div className={styled.continueReading}>
                        Wanna continue reading?
                        <Link href='/'>
                            <a>Subscribe new 🤗</a>
                        </Link>
                    </div>
                </article>
            </main>
        </>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [],
        fallback: 'blocking'
    }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const { slug } = params
    const prismic = getPrismicClient()

    const response = await prismic.getByUID('post', String(slug), {})

    if(!response) {
        return { 
            props: {
                post: 'error'
            }
        }
    }

    const post = {
        slug,
        title: RichText.asText(response.data.title),
        content: RichText.asHtml(response.data.content.splice(0, 3)),
        updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        }) 
    }

    return {
        props: {
            post
        }
    }
}