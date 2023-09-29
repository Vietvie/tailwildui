'use client';
import Image from 'next/image';

{/*R_IMPORT_START*/}
          import BlogSection1 from '@/components/BlogSection1'
          import BlogSection2 from '@/components/BlogSection2'
          import ContactSection6 from '@/components/ContactSection6'
          {/*R_IMPORT_END*/}

export default function Home() {
    return (
        <>
            {/*R_CONTENT_START*/}
          <BlogSection1 />
          <BlogSection2 />
          <ContactSection6 />
          {/*R_CONTENT_END*/}
        </>
    );
}
