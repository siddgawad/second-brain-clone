import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios, { type AxiosError } from "axios";

type Shared = { title: string; link: string; type: string };

function getErrMessage(e: unknown): string {
  const ax = e as AxiosError<{ message?: string }>;
  return ax?.response?.data?.message ?? "Not found";
}

export default function ShareView() {
  const { hash } = useParams();
  const [data, setData] = useState<Shared | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const base = import.meta.env.VITE_API_BASE as string;
        const url = `${base.replace(/\/api\/v1$/, "")}/api/v1/brain/${hash}`;
        const res = await axios.get<Shared>(url);
        if (!cancelled) setData(res.data);
      } catch (e: unknown) {
        if (!cancelled) setErr(getErrMessage(e));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [hash]);

  if (err) return <div className="max-w-md mx-auto bg-white p-4 rounded shadow-sm">{err}</div>;
  if (!data) return <div>Loading…</div>;

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow-sm">
      <h1 className="text-xl font-semibold mb-2">{data.title}</h1>
      <a href={data.link} target="_blank" rel="noreferrer" className="text-blue-600 break-all">
        {data.link}
      </a>
      <div className="text-xs text-neutral-500 mt-2">{data.type}</div>
    </div>
  );
}
