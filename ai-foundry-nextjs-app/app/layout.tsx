"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from 'next/link';
import { useState } from 'react';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // State to manage expanded/collapsed chapters
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null);

  // Function to toggle chapter visibility
  const toggleChapter = (chapter: string) => {
    setExpandedChapter(expandedChapter === chapter ? null : chapter);
  };

  return (
    <html lang="en">
      <body>
        <div style={{ display: 'flex', minHeight: '100vh' }}>
          <aside style={{ width: '220px', backgroundColor: '#2c3e50', color: '#ecf0f1', padding: '20px' }}>
            <h2 style={{ marginBottom: '20px', color: '#fff' }}>Navigation</h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {/* Chapter 1 */}
              <li style={{ marginBottom: '10px' }}>
                <div
                  onClick={() => toggleChapter('chapter1')}
                  style={{ cursor: 'pointer', padding: '10px', borderRadius: '5px', backgroundColor: '#34495e', color: '#ecf0f1' }}
                >
                  Beginner: AI Conversation
                </div>
                {expandedChapter === 'chapter1' && (
                  <ul style={{ listStyle: 'none', paddingLeft: '20px', marginTop: '10px' }}>
                    <li style={{ marginBottom: '10px' }}>
                      <Link href="/single-message" style={{ color: '#ecf0f1', textDecoration: 'none' }}>
                        Single Message
                      </Link>
                    </li>
                    <li style={{ marginBottom: '10px' }}>
                      <Link href="/conversation" style={{ color: '#ecf0f1', textDecoration: 'none' }}>
                        Conversation Chat
                      </Link>
                    </li>
                    <li style={{ marginBottom: '10px' }}>
                      <Link href="/stream" style={{ color: '#ecf0f1', textDecoration: 'none' }}>
                        Stream
                      </Link>
                    </li>
                  </ul>
                )}
              </li>

              {/* Chapter 2 */}
              <li style={{ marginBottom: '10px' }}>
                <div
                  onClick={() => toggleChapter('chapter2')}
                  style={{ cursor: 'pointer', padding: '10px', borderRadius: '5px', backgroundColor: '#34495e', color: '#ecf0f1' }}
                >
                  Multi-modal: AI Conversation
                </div>
                {expandedChapter === 'chapter2' && (
                  <ul style={{ listStyle: 'none', paddingLeft: '20px', marginTop: '10px' }}>
                    <li style={{ marginBottom: '10px' }}>
                      <Link href="/multimodel" style={{ color: '#ecf0f1', textDecoration: 'none' }}>
                      Multi-modal: Text, Image, Audio
                      </Link>
                    </li>
                  </ul>
                )}
              </li>

              {/* Chapter 3 */}
              <li style={{ marginBottom: '10px' }}>
                <div
                  onClick={() => toggleChapter('chapter3')}
                  style={{ cursor: 'pointer', padding: '10px', borderRadius: '5px', backgroundColor: '#34495e', color: '#ecf0f1' }}
                >
                  User Prompt Flow: AI Conversation
                </div>
                {expandedChapter === 'chapter3' && (
                  <ul style={{ listStyle: 'none', paddingLeft: '20px', marginTop: '10px' }}>
                    <li style={{ marginBottom: '10px' }}>
                      <Link href="/stream" style={{ color: '#ecf0f1', textDecoration: 'none' }}>
                        Stream
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
            </ul>
          </aside>
          <main style={{ flex: 1, padding: '30px', backgroundColor: '#f9f9f9' }}>{children}</main>
        </div>
      </body>
    </html>
  );
}