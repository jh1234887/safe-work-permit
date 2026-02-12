import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "permit-step2";

const Step2 = () => {
  const navigate = useNavigate();

  const [agreed, setAgreed] = useState(false);
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [fileOpened, setFileOpened] = useState(false);

  // Load saved data
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      setAgreed(data.agreed || false);
      setName(data.name || "");
      setDate(data.date || "");
      setFileOpened(data.fileOpened || false);
    }
  }, []);

  // Save on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ agreed, name, date, fileOpened }));
  }, [agreed, name, date, fileOpened]);

  const isComplete = agreed && name.trim() !== "" && date.trim() !== "";

  const handleNext = () => {
    if (!isComplete) return;
    navigate("/step3");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-lg flex-1 flex flex-col justify-center">
        <div className="text-center mb-8">
          <p className="text-lg text-foreground leading-relaxed">광동제약</p>
          <p className="text-lg text-foreground leading-relaxed font-bold">안전작업허가 기준입니다.</p>
          <p className="text-lg text-foreground leading-relaxed">확인 후 동의 해주세요</p>
        </div>

        <div className="border border-border rounded-lg p-6 mb-8 bg-card">
          <p className="text-sm text-muted-foreground mb-3 font-medium">안전작업허가 기준 내용</p>
          <div className="flex items-center gap-3">
            <a
              href="/safety-work-permit-standard.pdf"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setFileOpened(true)}
              className="flex items-center gap-2 px-4 py-3 rounded-md border border-border bg-muted hover:bg-accent transition-colors w-full"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-destructive shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              <span className="text-sm font-medium text-foreground">안전작업허가_기준.pdf</span>
              {fileOpened && <span className="ml-auto text-xs text-green-600 font-medium">열람완료 ✓</span>}
            </a>
          </div>
          {!fileOpened && (
            <p className="text-xs text-destructive mt-3">※ 첨부파일을 열어 확인한 후 동의할 수 있습니다.</p>
          )}
        </div>

        <div className="flex items-center justify-center gap-2 mb-6">
          <Checkbox id="agree" checked={agreed} disabled={!fileOpened} onCheckedChange={(checked) => setAgreed(checked === true)} />
          <label htmlFor="agree" className={`text-sm font-medium cursor-pointer ${!fileOpened ? 'text-muted-foreground' : 'text-foreground'}`}>동의하기</label>
        </div>

        <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm mb-10">
          <div className="flex items-center border-b border-border">
            <div className="w-28 shrink-0 px-4 py-3.5 bg-muted text-sm font-medium text-foreground">동의자 성명</div>
            <div className="flex-1 px-3 py-2">
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="성명을 입력하세요" className="border-0 shadow-none focus-visible:ring-0 bg-transparent text-sm" />
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-28 shrink-0 px-4 py-3.5 bg-muted text-sm font-medium text-foreground">동의 날짜</div>
            <div className="flex-1 px-3 py-2">
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="border-0 shadow-none focus-visible:ring-0 bg-transparent text-sm" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-6">
          <Button onClick={() => navigate("/")} variant="link" className="text-muted-foreground text-base font-medium hover:no-underline hover:opacity-70 transition-opacity">
            ← 이전
          </Button>
          <Button onClick={handleNext} disabled={!isComplete} variant="link" className="text-primary text-base font-medium hover:no-underline hover:opacity-70 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed">
            저장하고 다음 →
          </Button>
        </div>
      </div>
      
    </div>
  );
};

export default Step2;
