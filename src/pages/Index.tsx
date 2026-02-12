import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Shield, Lock, LogOut, Trash2, FileSpreadsheet } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import * as XLSX from "xlsx";
import logo from "@/assets/logo-kwangdong.jpg";

interface CompanyInfo {
  companyName: string;
  name: string;
  position: string;
  contact: string;
}

const STORAGE_KEY = "permit-step1";
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "23054";

const Index = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [info, setInfo] = useState<CompanyInfo>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : { companyName: "", name: "", position: "", contact: "" };
  });

  const [isAdmin, setIsAdmin] = useState(() => searchParams.get("admin") === "true" && sessionStorage.getItem("admin-auth") === "true");
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [submissions, setSubmissions] = useState<any[]>([]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(info));
  }, [info]);

  useEffect(() => {
    if (isAdmin) {
      const saved = JSON.parse(localStorage.getItem("permit-submissions") || "[]");
      setSubmissions(saved);
    }
  }, [isAdmin]);

  const isComplete = Object.values(info).every((v) => v.trim() !== "");

  const handleChange = (field: keyof CompanyInfo, value: string) => {
    setInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (!isComplete) return;
    navigate("/step2");
  };

  const handleAdminLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      sessionStorage.setItem("admin-auth", "true");
      setShowPasswordDialog(false);
      setPassword("");
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    sessionStorage.removeItem("admin-auth");
  };

  const handleDeleteSubmission = (id: string) => {
    const updated = submissions.filter((s) => s.id !== id);
    setSubmissions(updated);
    localStorage.setItem("permit-submissions", JSON.stringify(updated));
  };

  const handleExportExcel = () => {
    const rows = submissions.map((s: any) => ({
      "작성일": s.date || "",
      "시간": s.time || "",
      "회사명": s.companyName || "",
      "성명": s.name || "",
      "연락처": s.contact || "",
      "작업장소": s.step3Data?.workLocation || "",
      "작업내용": s.step3Data?.workContent || "",
      "설비(기기)": s.step3Data?.equipment || "",
      "허가번호": s.step3Data?.permitNumber || "",
      "허가일자": s.step3Data?.permitDate || "",
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "작업허가서목록");
    XLSX.writeFile(wb, `작업허가서_목록_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const fields: { key: keyof CompanyInfo; label: string; placeholder: string }[] = [
    { key: "companyName", label: "회사명", placeholder: "회사명을 입력하세요" },
    { key: "name", label: "성명", placeholder: "성명을 입력하세요" },
    { key: "position", label: "직책", placeholder: "직책을 입력하세요" },
    { key: "contact", label: "연락처", placeholder: "연락처를 입력하세요" },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      {/* Admin mode button */}
      <div className="w-full max-w-lg flex justify-end mb-2">
        {isAdmin ? (
          <Button onClick={handleAdminLogout} variant="ghost" size="sm" className="text-xs text-muted-foreground">
            <LogOut className="w-3 h-3 mr-1" /> 관리자 모드 종료
          </Button>
        ) : (
          <Button onClick={() => setShowPasswordDialog(true)} variant="ghost" size="sm" className="text-xs text-muted-foreground">
            <Lock className="w-3 h-3 mr-1" /> 관리자 모드
          </Button>
        )}
      </div>

      {isAdmin ? (
        <div className="w-full max-w-4xl flex-1">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
              <Shield className="w-7 h-7 text-primary" />
            </div>
            <p className="text-lg font-bold text-foreground">관리자 모드</p>
            <p className="text-sm text-muted-foreground mt-1">제출된 작업허가서 목록</p>
          </div>

          {submissions.length > 0 && (
            <div className="flex justify-end mb-3">
              <Button onClick={handleExportExcel} variant="outline" size="sm" className="text-xs">
                <FileSpreadsheet className="w-3.5 h-3.5 mr-1" /> Excel 저장
              </Button>
            </div>
          )}

          {submissions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">
              제출된 작업허가서가 없습니다.
            </div>
          ) : (
            <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="bg-muted border-b border-border">
                    <th className="px-3 py-2 text-left text-[11px] font-medium text-muted-foreground whitespace-nowrap">작성일</th>
                    <th className="px-2 py-2 text-left text-[11px] font-medium text-muted-foreground whitespace-nowrap">시간</th>
                    <th className="px-2 py-2 text-left text-[11px] font-medium text-muted-foreground whitespace-nowrap">회사명</th>
                    <th className="px-2 py-2 text-left text-[11px] font-medium text-muted-foreground whitespace-nowrap">성명</th>
                    <th className="px-2 py-2 text-left text-[11px] font-medium text-muted-foreground whitespace-nowrap">연락처</th>
                    <th className="px-2 py-2 text-left text-[11px] font-medium text-muted-foreground whitespace-nowrap">작업내용</th>
                    <th className="px-1 py-2 w-8"></th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((s: any) => (
                    <tr
                      key={s.id}
                      className="border-b border-border last:border-b-0 cursor-pointer hover:bg-accent/50 transition-colors"
                      onClick={() => navigate(`/admin/view/${s.id}`)}
                    >
                      <td className="px-3 py-2 text-[11px] text-foreground whitespace-nowrap">{s.date}</td>
                      <td className="px-2 py-2 text-[11px] text-foreground whitespace-nowrap">{s.time}</td>
                      <td className="px-2 py-2 text-[11px] font-medium text-foreground whitespace-nowrap">{s.companyName || "—"}</td>
                      <td className="px-2 py-2 text-[11px] text-foreground whitespace-nowrap">{s.name || "—"}</td>
                      <td className="px-2 py-2 text-[11px] text-muted-foreground whitespace-nowrap">{s.contact || "—"}</td>
                      <td className="px-2 py-2 text-[11px] text-muted-foreground">{s.step3Data?.workContent || "—"}</td>
                      <td className="px-1 py-2">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Trash2 className="w-3 h-3 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>정말 지우시겠습니까?</AlertDialogTitle>
                              <AlertDialogDescription>이 작업허가서를 삭제하면 복구할 수 없습니다.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>아니오</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteSubmission(s.id)}>예</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full max-w-lg flex-1 flex flex-col justify-center">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-6">
              <Shield className="w-7 h-7 text-primary" />
            </div>
            <p className="text-lg text-foreground leading-relaxed">만나서 반갑습니다.</p>
            <p className="text-lg text-foreground leading-relaxed font-bold">광동제약 식품환경기술팀입니다.</p>
            <p className="text-lg text-foreground leading-relaxed">오늘도 안전한 작업 부탁드립니다.</p>
          </div>

          <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm mb-10">
            {fields.map((field, idx) => (
              <div key={field.key} className={`flex items-center ${idx !== fields.length - 1 ? "border-b border-border" : ""}`}>
                <div className="w-28 shrink-0 px-4 py-3.5 bg-muted text-sm font-medium text-foreground">{field.label}</div>
                <div className="flex-1 px-3 py-2">
                  <Input
                    value={info[field.key]}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="border-0 shadow-none focus-visible:ring-0 bg-transparent text-sm"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button
              onClick={handleNext}
              disabled={!isComplete}
              variant="link"
              className="text-primary text-base font-medium hover:no-underline hover:opacity-70 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
            >
              저장하고 다음 →
            </Button>
          </div>
          <p className="text-center text-[11px] text-muted-foreground mt-4 leading-relaxed">
            안녕하세요<br />
            광동제약 식품환경기술팀 전수연입니다.<br />
            안전작업허가서 관련해서 문의사항이 있으시면<br />
            연락처 010-7211-8726 으로 언제든 연락주세요.
          </p>
        </div>
      )}

      <div className="py-6 flex flex-col items-center gap-3">
        <img src={logo} alt="광동제약 로고" className="h-8 object-contain" />
        
      </div>

      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>관리자 모드</DialogTitle>
            <DialogDescription>비밀번호를 입력해주세요.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setPasswordError(false); }}
              placeholder="비밀번호 입력"
              onKeyDown={(e) => e.key === "Enter" && handleAdminLogin()}
              autoFocus
            />
            {passwordError && (
              <p className="text-xs text-destructive">비밀번호가 올바르지 않습니다.</p>
            )}
            <Button onClick={handleAdminLogin} className="w-full">확인</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
