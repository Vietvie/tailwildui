'use client';
import Image from 'next/image';

{/*R_IMPORT_START*/}
          import BlogSection2 from '@/components/BlogSection2'
          import BlogSection5 from '@/components/BlogSection5'
          import Footers6 from '@/components/Footers6'
          {/*R_IMPORT_END*/}

export default function Home() {
    return (
        <>
            {/*R_CONTENT_START*/}
          <BlogSection2 />
          <BlogSection5 />
          <Footers6 />
          {/*R_CONTENT_END*/}
        </>
    );
}
