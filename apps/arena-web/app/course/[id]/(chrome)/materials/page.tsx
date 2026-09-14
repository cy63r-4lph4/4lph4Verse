"use client";

import { useParams } from "next/navigation";
import { Suspense } from "react";
import { CodexClient } from "./CodexClient";

export default function MaterialsPage() {
    const params = useParams();
    const courseId = params.id as string;
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CodexClient courseId={courseId} />
        </Suspense>
    );
}