"use client";

import { useApp } from "@/lib/store";
import { PageHeader } from "@/components/ui";
import { NoticeList } from "@/components/NoticeList";

export default function StudentNotices() {
  const notices = useApp((s) => s.notices);
  return (
    <>
      <PageHeader title="Notices" subtitle={`${notices.length} notices from school and your teachers`} />
      <NoticeList notices={notices} />
    </>
  );
}
