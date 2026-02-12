import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "permit-step3";

interface GasRow {
  substance: string;
  result: string;
  time: string;
  measurer: string;
}

interface Step3Data {
  permitNumber: string;
  permitDate: string;
  deptManager: string;
  deptApprover: string;
  periodFromDate: string;
  periodFromHour: string;
  periodFromMin: string;
  periodToDate: string;
  periodToHour: string;
  periodToMin: string;
  workLocation: string;
  equipment: string;
  workContent: string;
  contractor: string;
  emergencyContact: string;
  permitType: { general: boolean; fire: boolean };
  safetyChecks: Record<string, boolean>;
  safetyConfirms: Record<string, boolean>;
  supplementaryChecks: Record<string, boolean>;
  supplementaryConfirms: Record<string, boolean>;
  gasChecks: Record<string, boolean>;
  gasRows: GasRow[];
  // 작업완료
  completionTime: string;
  completionConfirmer: string;
  completionRestoration: string;
  // 안전조치확인
  safetyConfirmPerson: string;
  safetyConfirmApprover: string;
  // 공사업체 책임자
  contractorPosition: string;
  contractorName: string;
  // 작업허가 연장
  extensionYear: string;
  extensionMonth: string;
  extensionDay: string;
  extensionFrom: string;
  extensionTo: string;
  extensionApplicant: string;
  extensionApprover: string;
}

const defaultData: Step3Data = {
  permitNumber: "",
  permitDate: "",
  deptManager: "",
  deptApprover: "",
  periodFromDate: "",
  periodFromHour: "",
  periodFromMin: "",
  periodToDate: "",
  periodToHour: "",
  periodToMin: "",
  workLocation: "",
  equipment: "",
  workContent: "",
  contractor: "",
  emergencyContact: "",
  permitType: { general: false, fire: false },
  safetyChecks: {},
  safetyConfirms: {},
  supplementaryChecks: {},
  supplementaryConfirms: {},
  gasChecks: {},
  gasRows: [
    { substance: "", result: "", time: "", measurer: "" },
    { substance: "", result: "", time: "", measurer: "" },
    { substance: "", result: "", time: "", measurer: "" },
    { substance: "", result: "", time: "", measurer: "" },
    { substance: "", result: "", time: "", measurer: "" },
    { substance: "", result: "", time: "", measurer: "" },
  ],
  completionTime: "",
  completionConfirmer: "",
  completionRestoration: "",
  safetyConfirmPerson: "",
  safetyConfirmApprover: "",
  contractorPosition: "",
  contractorName: "",
  extensionYear: "",
  extensionMonth: "",
  extensionDay: "",
  extensionFrom: "",
  extensionTo: "",
  extensionApplicant: "",
  extensionApprover: "",
};

const safetyItems = [
  "작업구역 설정(출입경고 표지)",
  "작업주위 가연성물질 제거",
  "가스농도 측정",
  "밸브차단 및 차단표지부착(도면 비교)",
  "맹판설치 및 표지부착(도면 비교)",
  "위험물질(가연성분진 포함)반출 및 처리",
  "용기개방 및 압력방출",
  "용기내부 세정 및 처리",
  "불활성가스 치환 및 환기",
  "비산물(차단막 설치)",
  "환기장비",
  "조명장비",
  "소화기",
  "안전장구",
  "안전교육",
  "운전요원의 입회",
];

// 보충작업허가 체크박스 키 생성 헬퍼
const suppCheckKey = (cat: string, label: string) => `${cat}_${label}`;

const gasItems = [
  "HC: 0%",
  "O2: 18%이상",
  "CO: 30ppm미만",
  "CO2: 1.5%미만",
  "H2S: 10ppm미만",
];

const Step3 = () => {
  const navigate = useNavigate();

  // Load step1 data for applicant info
  const step1Data = (() => {
    const saved = localStorage.getItem("permit-step1");
    return saved ? JSON.parse(saved) : { companyName: "", name: "", position: "", contact: "" };
  })();

  const [data, setData] = useState<Step3Data>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? { ...defaultData, ...JSON.parse(saved) } : defaultData;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const updateField = (field: keyof Step3Data, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const togglePermitType = (type: "general" | "fire") => {
    setData((prev) => ({
      ...prev,
      permitType: { ...prev.permitType, [type]: !prev.permitType[type] },
    }));
  };

  const toggleSafetyCheck = (item: string) => {
    setData((prev) => ({
      ...prev,
      safetyChecks: { ...prev.safetyChecks, [item]: !prev.safetyChecks[item] },
    }));
  };

  const toggleSafetyConfirm = (item: string) => {
    setData((prev) => ({
      ...prev,
      safetyConfirms: { ...prev.safetyConfirms, [item]: !prev.safetyConfirms[item] },
    }));
  };

  const toggleSupplementaryCheck = (item: string) => {
    setData((prev) => ({
      ...prev,
      supplementaryChecks: { ...prev.supplementaryChecks, [item]: !prev.supplementaryChecks[item] },
    }));
  };

  const toggleSupplementaryConfirm = (item: string) => {
    setData((prev) => ({
      ...prev,
      supplementaryConfirms: { ...prev.supplementaryConfirms, [item]: !prev.supplementaryConfirms[item] },
    }));
  };

  const toggleGasCheck = (item: string) => {
    setData((prev) => ({
      ...prev,
      gasChecks: { ...prev.gasChecks, [item]: !prev.gasChecks[item] },
    }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-background p-4">
      <div className="w-full max-w-3xl mx-auto flex-1">
        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-foreground">작업허가서</h1>
        </div>

        {/* 허가번호 / 허가일자 / 부서담당자 / 부서승인자 */}
        <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm mb-4">
          <div className="bg-orange-100 px-4 py-2 text-sm font-bold text-foreground">광동제약 담당자 작성하는곳</div>
          <div className="divide-y divide-border">
            <div className="grid grid-cols-2 divide-x divide-border">
              <TableRow label="허가번호" value={data.permitNumber} onChange={(v) => updateField("permitNumber", v)} placeholder="허가번호" />
              <TableRow label="허가일자" value={data.permitDate} onChange={(v) => updateField("permitDate", v)} type="date" />
            </div>
            <div className="grid grid-cols-2 divide-x divide-border">
              <div className="flex items-center">
                <div className="w-28 shrink-0 px-4 py-3 bg-muted text-sm font-medium text-foreground">부서 담당자</div>
                <div className="flex-1 px-3 py-1">
                  <Input value={data.deptManager} onChange={(e) => updateField("deptManager", e.target.value)} placeholder="부서 담당자" className="border-0 shadow-none focus-visible:ring-0 bg-transparent text-sm" />
                </div>
                <span className="text-[10px] text-muted-foreground px-2 shrink-0">(서명)</span>
              </div>
              <div className="flex items-center">
                <div className="w-28 shrink-0 px-4 py-3 bg-muted text-sm font-medium text-foreground">부서 승인자</div>
                <div className="flex-1 px-3 py-1">
                  <Input value={data.deptApprover} onChange={(e) => updateField("deptApprover", e.target.value)} placeholder="부서 승인자" className="border-0 shadow-none focus-visible:ring-0 bg-transparent text-sm" />
                </div>
                <span className="text-[10px] text-muted-foreground px-2 shrink-0">(서명)</span>
              </div>
            </div>
          </div>
        </div>

        {/* 신청인 - auto filled from step 1 */}
        <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm mb-4">
          <div className="bg-primary/10 px-4 py-2 text-sm font-bold text-foreground">신청인</div>
          <div className="divide-y divide-border">
            <TableRow label="회사명" value={step1Data.companyName} readOnly />
            <TableRow label="직책" value={step1Data.position} readOnly />
            <TableRow label="성명" value={step1Data.name} readOnly />
            <TableRow label="연락처" value={step1Data.contact} readOnly />
          </div>
        </div>

        {/* 작업허가기간 */}
        <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm mb-4">
          <div className="bg-primary/10 px-4 py-2 text-sm font-bold text-foreground">작업허가기간</div>
          <div className="grid grid-cols-2 divide-x divide-border">
            {/* 시작 */}
            <div className="flex items-center">
              <div className="w-14 shrink-0 px-3 py-3 bg-muted text-xs font-medium text-foreground">시작</div>
              <div className="flex-1 flex items-center gap-1 px-2 py-1">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("h-8 w-28 text-xs justify-start font-normal", !data.periodFromDate && "text-muted-foreground")}>
                      <CalendarIcon className="mr-1 h-3 w-3" />
                      {data.periodFromDate ? format(new Date(data.periodFromDate), "yyyy-MM-dd") : "날짜"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={data.periodFromDate ? new Date(data.periodFromDate) : undefined}
                      onSelect={(date) => updateField("periodFromDate", date ? format(date, "yyyy-MM-dd") : "")}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
                <select value={data.periodFromHour} onChange={(e) => updateField("periodFromHour", e.target.value)} className="text-xs bg-transparent border border-border rounded px-1 py-1 h-8">
                  <option value="">시</option>
                  {Array.from({ length: 24 }, (_, i) => <option key={i} value={String(i)}>{i}시</option>)}
                </select>
                <select value={data.periodFromMin} onChange={(e) => updateField("periodFromMin", e.target.value)} className="text-xs bg-transparent border border-border rounded px-1 py-1 h-8">
                  <option value="">분</option>
                  {Array.from({ length: 60 }, (_, i) => <option key={i} value={String(i)}>{i}분</option>)}
                </select>
              </div>
            </div>
            {/* 종료 */}
            <div className="flex items-center">
              <div className="w-14 shrink-0 px-3 py-3 bg-muted text-xs font-medium text-foreground">종료</div>
              <div className="flex-1 flex items-center gap-1 px-2 py-1">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("h-8 w-28 text-xs justify-start font-normal", !data.periodToDate && "text-muted-foreground")}>
                      <CalendarIcon className="mr-1 h-3 w-3" />
                      {data.periodToDate ? format(new Date(data.periodToDate), "yyyy-MM-dd") : "날짜"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={data.periodToDate ? new Date(data.periodToDate) : undefined}
                      onSelect={(date) => updateField("periodToDate", date ? format(date, "yyyy-MM-dd") : "")}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
                <select value={data.periodToHour} onChange={(e) => updateField("periodToHour", e.target.value)} className="text-xs bg-transparent border border-border rounded px-1 py-1 h-8">
                  <option value="">시</option>
                  {Array.from({ length: 24 }, (_, i) => <option key={i} value={String(i)}>{i}시</option>)}
                </select>
                <select value={data.periodToMin} onChange={(e) => updateField("periodToMin", e.target.value)} className="text-xs bg-transparent border border-border rounded px-1 py-1 h-8">
                  <option value="">분</option>
                  {Array.from({ length: 60 }, (_, i) => <option key={i} value={String(i)}>{i}분</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* 작업장소 및 설비, 작업내용 */}
        <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm mb-4">
          <div className="divide-y divide-border">
            <TableRow label="작업장소" value={data.workLocation} onChange={(v) => updateField("workLocation", v)} placeholder="작업지역(장소)" />
            <TableRow label="설비(기기)" value={data.equipment} onChange={(v) => updateField("equipment", v)} placeholder="설비(기기)" />
            <TableRow label="작업내용" value={data.workContent} onChange={(v) => updateField("workContent", v)} placeholder="작업내용을 입력하세요" />
          </div>
        </div>


        {/* 허가서 구분 */}
        <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm mb-4">
          <div className="bg-primary/10 px-4 py-2 text-sm font-bold text-foreground">허가서 구분</div>
          <div className="flex items-center gap-6 px-4 py-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox checked={data.permitType.general} onCheckedChange={() => togglePermitType("general")} />
              <span className="text-sm text-foreground">일반위험작업허가서</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox checked={data.permitType.fire} onCheckedChange={() => togglePermitType("fire")} />
              <span className="text-sm text-foreground">화기작업허가서</span>
            </label>
          </div>
        </div>

        {/* 안전조치요구사항 */}
        <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm mb-4">
          <div className="bg-primary/10 px-4 py-2 text-sm font-bold text-foreground">안전조치요구사항 <span className="font-normal text-xs text-muted-foreground">(필요 부분 ☑ 체크, 확인 부분 ○ 체크는 광동제약 현장 확인 후 체크 예정)</span></div>
          <div className="grid grid-cols-2 divide-x divide-border">
            {[safetyItems.slice(0, Math.ceil(safetyItems.length / 2)), safetyItems.slice(Math.ceil(safetyItems.length / 2))].map((columnItems, colIdx) => (
              <div key={colIdx} className="px-3 py-2">
                <div className="grid grid-cols-[1fr_auto_auto] gap-x-2 gap-y-1 items-center">
                  <div className="text-xs font-medium text-muted-foreground">항목</div>
                  <div className="text-xs font-medium text-muted-foreground text-center w-10">필요</div>
                  <div className="text-xs font-medium text-muted-foreground text-center w-10">확인</div>
                  {columnItems.map((item) => (
                    <React.Fragment key={item}>
                      <span className="text-xs text-foreground py-1">{item}</span>
                      <div className="flex justify-center">
                        <Checkbox checked={!!data.safetyChecks[item]} onCheckedChange={() => toggleSafetyCheck(item)} className="rounded-none" />
                      </div>
                      <div className="flex justify-center">
                        <Checkbox checked={!!data.safetyConfirms[item]} onCheckedChange={() => toggleSafetyConfirm(item)} className="rounded-full" />
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 보충작업허가 */}
        <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm mb-4">
          <div className="bg-primary/10 px-4 py-1.5 text-sm font-bold text-foreground">보충작업허가 <span className="font-normal text-xs text-muted-foreground">(필요 부분 ☑ 체크, 확인 부분 ○ 체크는 광동제약 현장 확인 후 체크 예정)</span></div>
          <div className="divide-y divide-border">
            {/* 밀폐공간 */}
            <div className="flex">
              <div className="w-20 shrink-0 bg-muted flex items-center justify-center border-r border-border">
                <span className="text-xs font-bold text-foreground">밀폐공간</span>
              </div>
              <div className="flex-1 divide-y divide-border">
                <div className="px-2 py-1 text-xs text-foreground flex flex-wrap items-center gap-x-1 gap-y-0.5 min-h-[26px]">
                  <span>- 통신수단</span>
                  <Checkbox checked={!!data.supplementaryChecks[suppCheckKey("밀폐","통신수단")]} onCheckedChange={() => toggleSupplementaryCheck(suppCheckKey("밀폐","통신수단"))} className="rounded-none h-3.5 w-3.5" />
                  <Checkbox checked={!!data.supplementaryConfirms[suppCheckKey("밀폐","통신수단")]} onCheckedChange={() => toggleSupplementaryConfirm(suppCheckKey("밀폐","통신수단"))} className="rounded-full h-3.5 w-3.5" />
                  <span className="mx-0.5">-</span>
                  <span>구명장구(줄, 송기마스크)</span>
                  <Checkbox checked={!!data.supplementaryChecks[suppCheckKey("밀폐","구명장구")]} onCheckedChange={() => toggleSupplementaryCheck(suppCheckKey("밀폐","구명장구"))} className="rounded-none h-3.5 w-3.5" />
                  <Checkbox checked={!!data.supplementaryConfirms[suppCheckKey("밀폐","구명장구")]} onCheckedChange={() => toggleSupplementaryConfirm(suppCheckKey("밀폐","구명장구"))} className="rounded-full h-3.5 w-3.5" />
                </div>
                <div className="px-2 py-1 text-xs text-foreground flex items-center gap-1 flex-wrap min-h-[26px]">
                  <span>- 허가기간:</span>
                  <Input className="border-0 shadow-none focus-visible:ring-0 bg-transparent text-xs h-6 w-24 inline-flex" />
                  <span>~</span>
                  <Input className="border-0 shadow-none focus-visible:ring-0 bg-transparent text-xs h-6 w-24 inline-flex" />
                  <span>확인자</span>
                  <Input className="border-0 shadow-none focus-visible:ring-0 bg-transparent text-xs h-6 w-16 inline-flex" />
                  <span>(서명)</span>
                </div>
                <div className="px-2 py-1 text-xs text-foreground flex items-center min-h-[26px]">
                  ※ 산소농도측정 값: <Input className="border-0 shadow-none focus-visible:ring-0 bg-transparent text-xs h-6 w-12 inline-flex" /> % (산소농도 18% ~ 23.5%를 만족할 것)
                </div>
              </div>
            </div>

            {/* 정전 */}
            <div className="flex">
              <div className="w-20 shrink-0 bg-muted flex items-center justify-center border-r border-border">
                <span className="text-xs font-bold text-foreground">정전</span>
              </div>
              <div className="flex-1 divide-y divide-border">
                <div className="px-2 py-1 text-xs text-foreground flex items-center gap-1 flex-wrap min-h-[26px]">
                  <span>- 차단기기: 제어실(</span>
                  <Input className="border-0 shadow-none focus-visible:ring-0 bg-transparent text-xs h-6 w-16 inline-flex" />
                  <span>) 현장(</span>
                  <Input className="border-0 shadow-none focus-visible:ring-0 bg-transparent text-xs h-6 w-16 inline-flex" />
                  <span>)</span>
                </div>
                <div className="px-2 py-1 text-xs text-foreground flex items-center gap-1 flex-wrap min-h-[26px]">
                  <span>- 제어실: 스위치, 차단기 내림</span>
                  <Checkbox checked={!!data.supplementaryChecks[suppCheckKey("정전","제어실내림")]} onCheckedChange={() => toggleSupplementaryCheck(suppCheckKey("정전","제어실내림"))} className="rounded-none h-3.5 w-3.5" />
                  <Checkbox checked={!!data.supplementaryConfirms[suppCheckKey("정전","제어실내림")]} onCheckedChange={() => toggleSupplementaryConfirm(suppCheckKey("정전","제어실내림"))} className="rounded-full h-3.5 w-3.5" />
                  <span>/ 잠금장치 시건, 표지부착</span>
                  <Checkbox checked={!!data.supplementaryChecks[suppCheckKey("정전","제어실잠금")]} onCheckedChange={() => toggleSupplementaryCheck(suppCheckKey("정전","제어실잠금"))} className="rounded-none h-3.5 w-3.5" />
                  <Checkbox checked={!!data.supplementaryConfirms[suppCheckKey("정전","제어실잠금")]} onCheckedChange={() => toggleSupplementaryConfirm(suppCheckKey("정전","제어실잠금"))} className="rounded-full h-3.5 w-3.5" />
                </div>
                <div className="px-2 py-1 text-xs text-foreground flex items-center gap-1 flex-wrap min-h-[26px]">
                  <span>- 현 장: 스위치, 차단기 내림</span>
                  <Checkbox checked={!!data.supplementaryChecks[suppCheckKey("정전","현장내림")]} onCheckedChange={() => toggleSupplementaryCheck(suppCheckKey("정전","현장내림"))} className="rounded-none h-3.5 w-3.5" />
                  <Checkbox checked={!!data.supplementaryConfirms[suppCheckKey("정전","현장내림")]} onCheckedChange={() => toggleSupplementaryConfirm(suppCheckKey("정전","현장내림"))} className="rounded-full h-3.5 w-3.5" />
                  <span>/ 잠금장치 시건, 표지부착</span>
                  <Checkbox checked={!!data.supplementaryChecks[suppCheckKey("정전","현장잠금")]} onCheckedChange={() => toggleSupplementaryCheck(suppCheckKey("정전","현장잠금"))} className="rounded-none h-3.5 w-3.5" />
                  <Checkbox checked={!!data.supplementaryConfirms[suppCheckKey("정전","현장잠금")]} onCheckedChange={() => toggleSupplementaryConfirm(suppCheckKey("정전","현장잠금"))} className="rounded-full h-3.5 w-3.5" />
                </div>
                <div className="px-2 py-1 text-xs text-foreground flex items-center gap-1 flex-wrap min-h-[26px]">
                  <span>- 허가기간:</span>
                  <Input className="border-0 shadow-none focus-visible:ring-0 bg-transparent text-xs h-6 w-24 inline-flex" />
                  <span>~</span>
                  <Input className="border-0 shadow-none focus-visible:ring-0 bg-transparent text-xs h-6 w-24 inline-flex" />
                  <span>확인자:</span>
                  <Input className="border-0 shadow-none focus-visible:ring-0 bg-transparent text-xs h-6 w-16 inline-flex" />
                  <span>(서명)</span>
                </div>
                <div className="px-2 py-1 text-xs text-foreground flex items-center gap-1 flex-wrap min-h-[26px]">
                  <span>※ 전원복구: 요청자</span>
                  <Input className="border-0 shadow-none focus-visible:ring-0 bg-transparent text-xs h-6 w-20 inline-flex" />
                  <span>/ 복구시간:</span>
                  <Input className="border-0 shadow-none focus-visible:ring-0 bg-transparent text-xs h-6 w-20 inline-flex" />
                  <span>확인자:</span>
                  <Input className="border-0 shadow-none focus-visible:ring-0 bg-transparent text-xs h-6 w-16 inline-flex" />
                </div>
              </div>
            </div>

            {/* 굴착 */}
            <div className="flex">
              <div className="w-20 shrink-0 bg-muted flex items-center justify-center border-r border-border">
                <span className="text-xs font-bold text-foreground">굴착</span>
              </div>
              <div className="flex-1 divide-y divide-border">
                <div className="px-2 py-1 text-xs text-foreground flex items-center gap-1 flex-wrap min-h-[26px]">
                  <span>- 설비: 가스,기계,소방배관</span>
                  <Checkbox checked={!!data.supplementaryChecks[suppCheckKey("굴착","가스기계")]} onCheckedChange={() => toggleSupplementaryCheck(suppCheckKey("굴착","가스기계"))} className="rounded-none h-3.5 w-3.5" />
                  <Checkbox checked={!!data.supplementaryConfirms[suppCheckKey("굴착","가스기계")]} onCheckedChange={() => toggleSupplementaryConfirm(suppCheckKey("굴착","가스기계"))} className="rounded-full h-3.5 w-3.5" />
                  <span>/ 점검자:</span>
                  <Input className="border-0 shadow-none focus-visible:ring-0 bg-transparent text-xs h-6 w-20 inline-flex" />
                </div>
                <div className="px-2 py-1 text-xs text-foreground flex items-center gap-1 flex-wrap min-h-[26px]">
                  <span>- 설비: 전기,계장,통신</span>
                  <Checkbox checked={!!data.supplementaryChecks[suppCheckKey("굴착","전기계장")]} onCheckedChange={() => toggleSupplementaryCheck(suppCheckKey("굴착","전기계장"))} className="rounded-none h-3.5 w-3.5" />
                  <Checkbox checked={!!data.supplementaryConfirms[suppCheckKey("굴착","전기계장")]} onCheckedChange={() => toggleSupplementaryConfirm(suppCheckKey("굴착","전기계장"))} className="rounded-full h-3.5 w-3.5" />
                  <span>/ 점검자:</span>
                  <Input className="border-0 shadow-none focus-visible:ring-0 bg-transparent text-xs h-6 w-16 inline-flex" />
                  <span>허가기간:</span>
                  <Input className="border-0 shadow-none focus-visible:ring-0 bg-transparent text-xs h-6 w-16 inline-flex" />
                  <span>~</span>
                  <Input className="border-0 shadow-none focus-visible:ring-0 bg-transparent text-xs h-6 w-16 inline-flex" />
                  <span>확인자:</span>
                  <Input className="border-0 shadow-none focus-visible:ring-0 bg-transparent text-xs h-6 w-12 inline-flex" />
                  <span>(서명)</span>
                </div>
              </div>
            </div>

            {/* 고소 */}
            <div className="flex">
              <div className="w-20 shrink-0 bg-muted flex items-center justify-center border-r border-border">
                <span className="text-xs font-bold text-foreground">고소</span>
              </div>
              <div className="flex-1 divide-y divide-border">
                <div className="px-2 py-1 text-xs text-foreground flex items-center gap-1 flex-wrap min-h-[26px]">
                  <span>- 작업발판, 안전난간</span>
                  <Checkbox checked={!!data.supplementaryChecks[suppCheckKey("고소","발판난간")]} onCheckedChange={() => toggleSupplementaryCheck(suppCheckKey("고소","발판난간"))} className="rounded-none h-3.5 w-3.5" />
                  <Checkbox checked={!!data.supplementaryConfirms[suppCheckKey("고소","발판난간")]} onCheckedChange={() => toggleSupplementaryConfirm(suppCheckKey("고소","발판난간"))} className="rounded-full h-3.5 w-3.5" />
                  <span>/ 안전대 착용, 부착</span>
                  <Checkbox checked={!!data.supplementaryChecks[suppCheckKey("고소","안전대")]} onCheckedChange={() => toggleSupplementaryCheck(suppCheckKey("고소","안전대"))} className="rounded-none h-3.5 w-3.5" />
                  <Checkbox checked={!!data.supplementaryConfirms[suppCheckKey("고소","안전대")]} onCheckedChange={() => toggleSupplementaryConfirm(suppCheckKey("고소","안전대"))} className="rounded-full h-3.5 w-3.5" />
                  <span>/ 추락방지망</span>
                  <Checkbox checked={!!data.supplementaryChecks[suppCheckKey("고소","추락방지")]} onCheckedChange={() => toggleSupplementaryCheck(suppCheckKey("고소","추락방지"))} className="rounded-none h-3.5 w-3.5" />
                  <Checkbox checked={!!data.supplementaryConfirms[suppCheckKey("고소","추락방지")]} onCheckedChange={() => toggleSupplementaryConfirm(suppCheckKey("고소","추락방지"))} className="rounded-full h-3.5 w-3.5" />
                </div>
                <div className="px-2 py-1 text-xs text-foreground flex items-center gap-1 flex-wrap min-h-[26px]">
                  <span>- 허가기간:</span>
                  <Input className="border-0 shadow-none focus-visible:ring-0 bg-transparent text-xs h-6 w-24 inline-flex" />
                  <span>~</span>
                  <Input className="border-0 shadow-none focus-visible:ring-0 bg-transparent text-xs h-6 w-24 inline-flex" />
                  <span>확인자</span>
                  <Input className="border-0 shadow-none focus-visible:ring-0 bg-transparent text-xs h-6 w-16 inline-flex" />
                  <span>(서명)</span>
                </div>
              </div>
            </div>

            {/* 중장비 */}
            <div className="flex">
              <div className="w-20 shrink-0 bg-muted flex items-center justify-center border-r border-border">
                <span className="text-xs font-bold text-foreground">중장비</span>
              </div>
              <div className="flex-1 divide-y divide-border">
                <div className="px-2 py-1 text-xs text-foreground flex items-center gap-1 flex-wrap min-h-[26px]">
                  <span>- 투입장비: (</span>
                  <Input className="border-0 shadow-none focus-visible:ring-0 bg-transparent text-xs h-6 w-24 inline-flex" />
                  <span>) / 자격증 소지</span>
                  <Checkbox checked={!!data.supplementaryChecks[suppCheckKey("중장비","자격증")]} onCheckedChange={() => toggleSupplementaryCheck(suppCheckKey("중장비","자격증"))} className="rounded-none h-3.5 w-3.5" />
                  <Checkbox checked={!!data.supplementaryConfirms[suppCheckKey("중장비","자격증")]} onCheckedChange={() => toggleSupplementaryConfirm(suppCheckKey("중장비","자격증"))} className="rounded-full h-3.5 w-3.5" />
                  <span>/ 현장책임자 감독</span>
                  <Checkbox checked={!!data.supplementaryChecks[suppCheckKey("중장비","감독")]} onCheckedChange={() => toggleSupplementaryCheck(suppCheckKey("중장비","감독"))} className="rounded-none h-3.5 w-3.5" />
                  <Checkbox checked={!!data.supplementaryConfirms[suppCheckKey("중장비","감독")]} onCheckedChange={() => toggleSupplementaryConfirm(suppCheckKey("중장비","감독"))} className="rounded-full h-3.5 w-3.5" />
                </div>
                <div className="px-2 py-1 text-xs text-foreground flex items-center gap-1 flex-wrap min-h-[26px]">
                  <span>- 기상, 노면상태</span>
                  <Checkbox checked={!!data.supplementaryChecks[suppCheckKey("중장비","노면")]} onCheckedChange={() => toggleSupplementaryCheck(suppCheckKey("중장비","노면"))} className="rounded-none h-3.5 w-3.5" />
                  <Checkbox checked={!!data.supplementaryConfirms[suppCheckKey("중장비","노면")]} onCheckedChange={() => toggleSupplementaryConfirm(suppCheckKey("중장비","노면"))} className="rounded-full h-3.5 w-3.5" />
                  <span>/ 전선, 설비 간섭</span>
                  <Checkbox checked={!!data.supplementaryChecks[suppCheckKey("중장비","간섭")]} onCheckedChange={() => toggleSupplementaryCheck(suppCheckKey("중장비","간섭"))} className="rounded-none h-3.5 w-3.5" />
                  <Checkbox checked={!!data.supplementaryConfirms[suppCheckKey("중장비","간섭")]} onCheckedChange={() => toggleSupplementaryConfirm(suppCheckKey("중장비","간섭"))} className="rounded-full h-3.5 w-3.5" />
                  <span>/ 신호수배치</span>
                  <Checkbox checked={!!data.supplementaryChecks[suppCheckKey("중장비","신호수")]} onCheckedChange={() => toggleSupplementaryCheck(suppCheckKey("중장비","신호수"))} className="rounded-none h-3.5 w-3.5" />
                  <Checkbox checked={!!data.supplementaryConfirms[suppCheckKey("중장비","신호수")]} onCheckedChange={() => toggleSupplementaryConfirm(suppCheckKey("중장비","신호수"))} className="rounded-full h-3.5 w-3.5" />
                  <span>/ 매트 등 부속장구</span>
                  <Checkbox checked={!!data.supplementaryChecks[suppCheckKey("중장비","부속장구")]} onCheckedChange={() => toggleSupplementaryCheck(suppCheckKey("중장비","부속장구"))} className="rounded-none h-3.5 w-3.5" />
                  <Checkbox checked={!!data.supplementaryConfirms[suppCheckKey("중장비","부속장구")]} onCheckedChange={() => toggleSupplementaryConfirm(suppCheckKey("중장비","부속장구"))} className="rounded-full h-3.5 w-3.5" />
                </div>
                <div className="px-2 py-1 text-xs text-foreground flex items-center gap-1 flex-wrap min-h-[26px]">
                  <span>- 운전원 허가기간:</span>
                  <Input className="border-0 shadow-none focus-visible:ring-0 bg-transparent text-xs h-6 w-24 inline-flex" />
                  <span>~</span>
                  <Input className="border-0 shadow-none focus-visible:ring-0 bg-transparent text-xs h-6 w-24 inline-flex" />
                  <span>/ 확인자:</span>
                  <Input className="border-0 shadow-none focus-visible:ring-0 bg-transparent text-xs h-6 w-16 inline-flex" />
                  <span>(서명)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 가스농도 측정 */}
        <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm mb-6">
          {/* 가스농도 측정 테이블 */}
          <div className="flex border-b border-border">
            <div className="w-20 shrink-0 bg-primary/10 flex items-center justify-center border-r border-border">
              <span className="text-xs font-bold text-foreground text-center leading-tight">가스농도<br/>측정</span>
            </div>
            <div className="flex-1">
              {/* 헤더: 좌우 8컬럼 (물질명,결과,측정시간,측정자확인 x2) */}
              <div className="grid grid-cols-8 bg-muted text-center border-b border-border">
                <div className="px-1 py-2 text-[10px] font-medium text-foreground border-r border-border">물질명</div>
                <div className="px-1 py-2 text-[10px] font-medium text-foreground border-r border-border">결과</div>
                <div className="px-1 py-2 text-[10px] font-medium text-foreground border-r border-border">측정시간</div>
                <div className="px-1 py-2 text-[10px] font-medium text-foreground border-r-2 border-border">측정자확인</div>
                <div className="px-1 py-2 text-[10px] font-medium text-foreground border-r border-border">물질명</div>
                <div className="px-1 py-2 text-[10px] font-medium text-foreground border-r border-border">결과</div>
                <div className="px-1 py-2 text-[10px] font-medium text-foreground border-r border-border">측정시간</div>
                <div className="px-1 py-2 text-[10px] font-medium text-foreground">측정자확인</div>
              </div>
              {/* 데이터 행: 좌우 쌍으로 */}
              {(() => {
                const rows = data.gasRows || defaultData.gasRows;
                const half = Math.ceil(rows.length / 2);
                const rowCount = half;
                return Array.from({ length: rowCount }).map((_, i) => {
                  const leftRow = rows[i];
                  const rightRow = rows[i + half];
                  return (
                    <div key={i} className="grid grid-cols-8 border-b border-border last:border-b-0">
                      {(["substance", "result", "time", "measurer"] as const).map((field) => (
                        <div key={`left-${field}`} className={field === "measurer" ? "border-r-2 border-border" : "border-r border-border"}>
                          <Input
                            value={leftRow?.[field] || ""}
                            onChange={(e) => {
                              const newRows = [...rows];
                              newRows[i] = { ...newRows[i], [field]: e.target.value };
                              setData((prev) => ({ ...prev, gasRows: newRows }));
                            }}
                            className="border-0 shadow-none focus-visible:ring-0 bg-transparent text-[10px] h-8 rounded-none px-1 text-center"
                          />
                        </div>
                      ))}
                      {(["substance", "result", "time", "measurer"] as const).map((field, fIdx) => (
                        <div key={`right-${field}`} className={fIdx < 3 ? "border-r border-border" : ""}>
                          {rightRow ? (
                            <Input
                              value={rightRow[field] || ""}
                              onChange={(e) => {
                                const newRows = [...rows];
                                newRows[i + half] = { ...newRows[i + half], [field]: e.target.value };
                                setData((prev) => ({ ...prev, gasRows: newRows }));
                              }}
                              className="border-0 shadow-none focus-visible:ring-0 bg-transparent text-[10px] h-8 rounded-none px-1 text-center"
                            />
                          ) : <div className="h-8" />}
                        </div>
                      ))}
                    </div>
                  );
                });
              })()}
            </div>
          </div>
          {/* 가스저장소(밀폐작업) 측정 기준 */}
          <div className="flex">
            <div className="w-20 shrink-0 bg-primary/10 flex items-center justify-center border-r border-border">
              <span className="text-xs font-bold text-foreground text-center leading-tight">가스저장소<br/>(밀폐작업)</span>
            </div>
            <div className="flex-1 px-3 py-2 flex items-center">
              <p className="text-[10px] text-foreground">가스농도 측정결과 ① HC: 0% ② O2: 18%이상 ③ CO: 30ppm미만 ④ CO2: 1.5%미만 ⑤ H2S: 10ppm미만</p>
            </div>
          </div>
        </div>

        {/* 작업완료 */}
        <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm mb-4">
          <div className="flex">
            <div className="w-20 shrink-0 bg-primary/10 flex items-center justify-center border-r border-border">
              <span className="text-xs font-bold text-foreground text-center">작업완료</span>
            </div>
            <div className="flex-1 divide-y divide-border">
              <div className="grid grid-cols-3 divide-x divide-border">
                <div className="flex items-center">
                  <div className="w-14 shrink-0 px-2 py-2 bg-muted text-[10px] font-medium text-foreground">시간:</div>
                  <div className="flex-1 px-1">
                    <Input value={data.completionTime} onChange={(e) => updateField("completionTime", e.target.value)} className="border-0 shadow-none focus-visible:ring-0 bg-transparent text-[10px] h-7" />
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-14 shrink-0 px-2 py-2 bg-muted text-[10px] font-medium text-foreground">확인자:</div>
                  <div className="flex-1 px-1">
                    <Input value={data.completionConfirmer} onChange={(e) => updateField("completionConfirmer", e.target.value)} className="border-0 shadow-none focus-visible:ring-0 bg-transparent text-[10px] h-7" />
                  </div>
                  <span className="text-[10px] text-muted-foreground px-2 shrink-0">(서명)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-24 shrink-0 px-2 py-2 bg-muted text-[10px] font-medium text-foreground">복원(조치)상태:</div>
                  <div className="flex-1 px-1">
                    <Input value={data.completionRestoration} onChange={(e) => updateField("completionRestoration", e.target.value)} className="border-0 shadow-none focus-visible:ring-0 bg-transparent text-[10px] h-7" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


        <p className="text-[10px] text-destructive mb-1 px-1">※ 작업 연장시 작성 및 승인 必</p>
        {/* 작업허가 연장 */}
        <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm mb-4">
          <div className="flex">
            <div className="w-20 shrink-0 bg-primary/10 flex items-center justify-center border-r border-border">
              <span className="text-xs font-bold text-foreground text-center leading-tight">작업허가<br/>연장</span>
            </div>
            <div className="flex-1 px-3 py-3">
              <div className="flex items-end gap-2 flex-wrap">
                <div className="flex items-center gap-1">
                  <Input value={data.extensionYear} onChange={(e) => updateField("extensionYear", e.target.value)} className="border-b border-border border-t-0 border-l-0 border-r-0 rounded-none shadow-none focus-visible:ring-0 bg-transparent text-sm h-8 w-16 text-center" />
                  <span className="text-xs text-foreground">년</span>
                </div>
                <div className="flex items-center gap-1">
                  <Input value={data.extensionMonth} onChange={(e) => updateField("extensionMonth", e.target.value)} className="border-b border-border border-t-0 border-l-0 border-r-0 rounded-none shadow-none focus-visible:ring-0 bg-transparent text-sm h-8 w-12 text-center" />
                  <span className="text-xs text-foreground">월</span>
                </div>
                <div className="flex items-center gap-1">
                  <Input value={data.extensionDay} onChange={(e) => updateField("extensionDay", e.target.value)} className="border-b border-border border-t-0 border-l-0 border-r-0 rounded-none shadow-none focus-visible:ring-0 bg-transparent text-sm h-8 w-12 text-center" />
                  <span className="text-xs text-foreground">일</span>
                </div>
                <div className="flex items-center gap-1">
                  <Input value={data.extensionFrom} onChange={(e) => updateField("extensionFrom", e.target.value)} className="border-b border-border border-t-0 border-l-0 border-r-0 rounded-none shadow-none focus-visible:ring-0 bg-transparent text-sm h-8 w-14 text-center" />
                  <span className="text-xs text-foreground whitespace-nowrap">시부터</span>
                </div>
                <div className="flex items-center gap-1">
                  <Input value={data.extensionTo} onChange={(e) => updateField("extensionTo", e.target.value)} className="border-b border-border border-t-0 border-l-0 border-r-0 rounded-none shadow-none focus-visible:ring-0 bg-transparent text-sm h-8 w-14 text-center" />
                  <span className="text-xs text-foreground whitespace-nowrap">시 까지</span>
                </div>
                <div className="flex items-center gap-1 ml-auto">
                  <span className="text-xs text-foreground whitespace-nowrap">신청인</span>
                  <Input value={data.extensionApplicant} onChange={(e) => updateField("extensionApplicant", e.target.value)} className="border-b border-border border-t-0 border-l-0 border-r-0 rounded-none shadow-none focus-visible:ring-0 bg-transparent text-sm h-8 w-24 text-center" />
                  <span className="text-[10px] text-muted-foreground shrink-0">(서명)</span>
                </div>
              </div>
              <div className="flex items-center gap-1 justify-end mt-2">
                <span className="text-xs text-foreground whitespace-nowrap">승인자</span>
                <Input value={data.extensionApprover} onChange={(e) => updateField("extensionApprover", e.target.value)} className="border-b border-border border-t-0 border-l-0 border-r-0 rounded-none shadow-none focus-visible:ring-0 bg-transparent text-sm h-8 w-24 text-center" />
                <span className="text-[10px] text-muted-foreground shrink-0">(서명)</span>
              </div>
            </div>
          </div>
        </div>

        {/* 공사업체 책임자 */}
        <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm mb-6">
          <div className="flex">
            <div className="w-20 shrink-0 bg-primary/10 flex items-center justify-center border-r border-border">
              <span className="text-xs font-bold text-foreground text-center leading-tight">공사업체<br/>책임자</span>
            </div>
            <div className="flex-1">
              <div className="grid grid-cols-2 divide-x divide-border">
                <div className="flex items-center">
                  <div className="w-14 shrink-0 px-2 py-2 bg-muted text-xs font-medium text-foreground">직책</div>
                  <div className="flex-1 px-1">
                    <Input value={data.contractorPosition} onChange={(e) => updateField("contractorPosition", e.target.value)} className="border-0 shadow-none focus-visible:ring-0 bg-transparent text-xs h-7" />
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-14 shrink-0 px-2 py-2 bg-muted text-xs font-medium text-foreground">성명</div>
                  <div className="flex-1 px-1">
                    <Input value={data.contractorName} onChange={(e) => updateField("contractorName", e.target.value)} className="border-0 shadow-none focus-visible:ring-0 bg-transparent text-xs h-7" />
                  </div>
                  <span className="text-[10px] text-muted-foreground px-2 shrink-0">(서명)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-6 mb-4">
          <Button onClick={() => navigate("/step2")} variant="link" className="text-muted-foreground text-base font-medium hover:no-underline hover:opacity-70 transition-opacity">
            ← 이전
          </Button>
          <Button onClick={() => {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            // Save submission record
            const step1 = JSON.parse(localStorage.getItem("permit-step1") || "{}");
            const step2 = JSON.parse(localStorage.getItem("permit-step2") || "{}");
            const now = new Date();
            const submission = {
              id: Date.now().toString(),
              submittedAt: now.toISOString(),
              date: now.toLocaleDateString("ko-KR"),
              time: now.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
              companyName: step1.companyName || "",
              name: step1.name || "",
              contact: step1.contact || "",
              step1Data: step1,
              step2Data: step2,
              step3Data: data,
            };
            const existing = JSON.parse(localStorage.getItem("permit-submissions") || "[]");
            existing.unshift(submission);
            localStorage.setItem("permit-submissions", JSON.stringify(existing));
            toast.success("저장이 완료되었습니다");
            navigate("/");
          }} variant="link" className="text-primary text-base font-medium hover:no-underline hover:opacity-70 transition-opacity">
            완료
          </Button>
        </div>
      </div>

      
    </div>
  );
};

/* Reusable row components */
const TableRow = ({ label, value, onChange, placeholder, readOnly, type }: {
  label: string; value: string; onChange?: (v: string) => void; placeholder?: string; readOnly?: boolean; type?: string;
}) => (
  <div className="flex items-center">
    <div className="w-28 shrink-0 px-4 py-3 bg-muted text-sm font-medium text-foreground">{label}</div>
    <div className="flex-1 px-3 py-1">
      {readOnly ? (
        <span className="text-sm text-foreground px-1">{value || "—"}</span>
      ) : (
        <Input type={type || "text"} value={value} onChange={(e) => onChange?.(e.target.value)} placeholder={placeholder} className="border-0 shadow-none focus-visible:ring-0 bg-transparent text-sm" />
      )}
    </div>
  </div>
);

const FormRow = ({ label, value, onChange, placeholder, type }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) => (
  <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm">
    <div className="flex items-center">
      <div className="w-24 shrink-0 px-3 py-3 bg-muted text-xs font-medium text-foreground">{label}</div>
      <div className="flex-1 px-2 py-1">
        <Input type={type || "text"} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="border-0 shadow-none focus-visible:ring-0 bg-transparent text-xs" />
      </div>
    </div>
  </div>
);

export default Step3;
