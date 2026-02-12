import React, { useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Printer } from "lucide-react";

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

const suppCheckKey = (cat: string, label: string) => `${cat}_${label}`;

const AdminView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const printRef = useRef<HTMLDivElement>(null);

  const submissions = JSON.parse(localStorage.getItem("permit-submissions") || "[]");
  const submission = submissions.find((s: any) => s.id === id);

  if (!submission) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center">
          <p className="text-foreground mb-4">제출 내역을 찾을 수 없습니다.</p>
          <Button onClick={() => navigate("/?admin=true")} variant="outline">돌아가기</Button>
        </div>
      </div>
    );
  }

  const step1Data = submission.step1Data || {};
  const step2Data = submission.step2Data || {};
  const data = submission.step3Data || {};

  const handlePrint = () => {
    window.print();
  };

  const ReadOnlyField = ({ value, className = "" }: { value: string; className?: string }) => (
    <span className={`text-sm text-foreground px-1 ${className}`}>{value || ""}</span>
  );

  const ReadOnlyFieldSmall = ({ value, className = "" }: { value: string; className?: string }) => (
    <span className={`text-xs text-foreground ${className}`}>{value || ""}</span>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background p-4 print:p-0 print:bg-white">
      <div className="w-full max-w-4xl mx-auto flex-1 print-a4">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-4 print:hidden">
          <Button onClick={() => navigate("/?admin=true")} variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-1" /> 목록으로
          </Button>
          <Button onClick={handlePrint} variant="outline" size="sm">
            <Printer className="w-4 h-4 mr-1" /> 인쇄
          </Button>
        </div>

        <div ref={printRef}>
          {/* ===== 2페이지: 안전작업허가 기준 동의 ===== */}
          <div className="text-center mb-6">
            <p className="text-lg text-foreground leading-relaxed">광동제약</p>
            <p className="text-lg text-foreground leading-relaxed font-bold">안전작업허가 기준</p>
          </div>

          <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm mb-4">
            <div className="bg-primary/10 px-4 py-2 text-sm font-bold text-foreground">안전작업허가 기준 동의</div>
            <div className="divide-y divide-border">
              <ROField label="동의 여부" value={step2Data.agreed ? "동의함 ✓" : "미동의"} />
              <ROField label="동의자 성명" value={step2Data.name} />
              <ROField label="동의 날짜" value={step2Data.date} />
            </div>
          </div>


          {/* ===== 3페이지: 작업허가서 ===== */}
          {/* Title */}
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold text-foreground">작업허가서</h1>
          </div>

          {/* 허가번호 / 허가일자 / 부서담당자 / 부서승인자 */}
          <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm mb-4">
            <div className="bg-orange-100 px-4 py-2 text-sm font-bold text-foreground">광동제약 담당자 작성하는곳</div>
            <div className="divide-y divide-border">
              <div className="grid grid-cols-2 divide-x divide-border">
                <ROField label="허가번호" value={data.permitNumber} />
                <ROField label="허가일자" value={data.permitDate} />
              </div>
              <div className="grid grid-cols-2 divide-x divide-border">
                <div className="flex items-center">
                  <div className="w-28 shrink-0 px-4 py-3 bg-muted text-sm font-medium text-foreground">부서 담당자</div>
                  <div className="flex-1 px-3 py-1"><ReadOnlyField value={data.deptManager} /></div>
                  <span className="text-[10px] text-muted-foreground px-2 shrink-0">(서명)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-28 shrink-0 px-4 py-3 bg-muted text-sm font-medium text-foreground">부서 승인자</div>
                  <div className="flex-1 px-3 py-1"><ReadOnlyField value={data.deptApprover} /></div>
                  <span className="text-[10px] text-muted-foreground px-2 shrink-0">(서명)</span>
                </div>
              </div>
            </div>
          </div>

          {/* 신청인 */}
          <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm mb-4">
            <div className="bg-primary/10 px-4 py-2 text-sm font-bold text-foreground">신청인</div>
            <div className="divide-y divide-border">
              <ROField label="회사명" value={step1Data.companyName} />
              <ROField label="직책" value={step1Data.position} />
              <ROField label="성명" value={step1Data.name} />
              <ROField label="연락처" value={step1Data.contact} />
            </div>
          </div>

          {/* 작업허가기간 */}
          <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm mb-4">
            <div className="bg-primary/10 px-4 py-2 text-sm font-bold text-foreground">작업허가기간</div>
            <div className="grid grid-cols-2 divide-x divide-border">
              <div className="flex items-center">
                <div className="w-14 shrink-0 px-3 py-3 bg-muted text-xs font-medium text-foreground">시작</div>
                <div className="flex-1 px-2 py-2 text-xs text-foreground">
                  {data.periodFromDate || ""} {data.periodFromHour ? `${data.periodFromHour}시` : ""} {data.periodFromMin ? `${data.periodFromMin}분` : ""}
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-14 shrink-0 px-3 py-3 bg-muted text-xs font-medium text-foreground">종료</div>
                <div className="flex-1 px-2 py-2 text-xs text-foreground">
                  {data.periodToDate || ""} {data.periodToHour ? `${data.periodToHour}시` : ""} {data.periodToMin ? `${data.periodToMin}분` : ""}
                </div>
              </div>
            </div>
          </div>

          {/* 작업장소 및 설비, 작업내용 */}
          <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm mb-4">
            <div className="divide-y divide-border">
              <ROField label="작업장소" value={data.workLocation} />
              <ROField label="설비(기기)" value={data.equipment} />
              <ROField label="작업내용" value={data.workContent} />
            </div>
          </div>

          {/* 허가서 구분 */}
          <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm mb-4">
            <div className="bg-primary/10 px-4 py-2 text-sm font-bold text-foreground">허가서 구분</div>
            <div className="flex items-center gap-6 px-4 py-3">
              <label className="flex items-center gap-2">
                <Checkbox checked={!!data.permitType?.general} disabled />
                <span className="text-sm text-foreground">일반위험작업허가서</span>
              </label>
              <label className="flex items-center gap-2">
                <Checkbox checked={!!data.permitType?.fire} disabled />
                <span className="text-sm text-foreground">화기작업허가서</span>
              </label>
            </div>
          </div>

          {/* 안전조치요구사항 */}
          <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm mb-4">
            <div className="bg-primary/10 px-4 py-2 text-sm font-bold text-foreground">안전조치요구사항</div>
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
                          <Checkbox checked={!!data.safetyChecks?.[item]} disabled className="rounded-none" />
                        </div>
                        <div className="flex justify-center">
                          <Checkbox checked={!!data.safetyConfirms?.[item]} disabled className="rounded-full" />
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
            <div className="bg-primary/10 px-4 py-1.5 text-sm font-bold text-foreground">보충작업허가</div>
            <div className="divide-y divide-border">
              {/* 밀폐공간 */}
              <div className="flex">
                <div className="w-20 shrink-0 bg-muted flex items-center justify-center border-r border-border">
                  <span className="text-xs font-bold text-foreground">밀폐공간</span>
                </div>
                <div className="flex-1 divide-y divide-border">
                  <div className="px-2 py-1 text-xs text-foreground flex flex-wrap items-center gap-x-1 gap-y-0.5 min-h-[26px]">
                    <span>- 통신수단</span>
                    <Checkbox checked={!!data.supplementaryChecks?.[suppCheckKey("밀폐","통신수단")]} disabled className="rounded-none h-3.5 w-3.5" />
                    <Checkbox checked={!!data.supplementaryConfirms?.[suppCheckKey("밀폐","통신수단")]} disabled className="rounded-full h-3.5 w-3.5" />
                    <span className="mx-0.5">-</span>
                    <span>구명장구(줄, 송기마스크)</span>
                    <Checkbox checked={!!data.supplementaryChecks?.[suppCheckKey("밀폐","구명장구")]} disabled className="rounded-none h-3.5 w-3.5" />
                    <Checkbox checked={!!data.supplementaryConfirms?.[suppCheckKey("밀폐","구명장구")]} disabled className="rounded-full h-3.5 w-3.5" />
                  </div>
                  <div className="px-2 py-1 text-xs text-foreground flex items-center gap-1 flex-wrap min-h-[26px]">
                    <span>- 허가기간:</span>
                    <span className="inline-block w-24">{data.confinedPeriodFrom || ""}</span>
                    <span>~</span>
                    <span className="inline-block w-24">{data.confinedPeriodTo || ""}</span>
                    <span>확인자</span>
                    <span className="inline-block w-16">{data.confinedConfirmer || ""}</span>
                    <span>(서명)</span>
                  </div>
                  <div className="px-2 py-1 text-xs text-foreground flex items-center min-h-[26px]">
                    <span>※ 산소농도측정 값:</span>
                    <span className="inline-block w-12 mx-1">{data.confinedOxygen || ""}</span>
                    <span>% (산소농도 18% ~ 23.5%를 만족할 것)</span>
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
                    <span className="inline-block w-16">{data.blackoutControlRoom || ""}</span>
                    <span>) 현장(</span>
                    <span className="inline-block w-16">{data.blackoutField || ""}</span>
                    <span>)</span>
                  </div>
                  <div className="px-2 py-1 text-xs text-foreground flex items-center gap-1 flex-wrap min-h-[26px]">
                    <span>- 제어실: 스위치, 차단기 내림</span>
                    <Checkbox checked={!!data.supplementaryChecks?.[suppCheckKey("정전","제어실내림")]} disabled className="rounded-none h-3.5 w-3.5" />
                    <Checkbox checked={!!data.supplementaryConfirms?.[suppCheckKey("정전","제어실내림")]} disabled className="rounded-full h-3.5 w-3.5" />
                    <span>/ 잠금장치 시건, 표지부착</span>
                    <Checkbox checked={!!data.supplementaryChecks?.[suppCheckKey("정전","제어실잠금")]} disabled className="rounded-none h-3.5 w-3.5" />
                    <Checkbox checked={!!data.supplementaryConfirms?.[suppCheckKey("정전","제어실잠금")]} disabled className="rounded-full h-3.5 w-3.5" />
                  </div>
                  <div className="px-2 py-1 text-xs text-foreground flex items-center gap-1 flex-wrap min-h-[26px]">
                    <span>- 현 장: 스위치, 차단기 내림</span>
                    <Checkbox checked={!!data.supplementaryChecks?.[suppCheckKey("정전","현장내림")]} disabled className="rounded-none h-3.5 w-3.5" />
                    <Checkbox checked={!!data.supplementaryConfirms?.[suppCheckKey("정전","현장내림")]} disabled className="rounded-full h-3.5 w-3.5" />
                    <span>/ 잠금장치 시건, 표지부착</span>
                    <Checkbox checked={!!data.supplementaryChecks?.[suppCheckKey("정전","현장잠금")]} disabled className="rounded-none h-3.5 w-3.5" />
                    <Checkbox checked={!!data.supplementaryConfirms?.[suppCheckKey("정전","현장잠금")]} disabled className="rounded-full h-3.5 w-3.5" />
                  </div>
                  <div className="px-2 py-1 text-xs text-foreground flex items-center gap-1 flex-wrap min-h-[26px]">
                    <span>- 허가기간:</span>
                    <span className="inline-block w-24">{data.blackoutPeriodFrom || ""}</span>
                    <span>~</span>
                    <span className="inline-block w-24">{data.blackoutPeriodTo || ""}</span>
                    <span>확인자:</span>
                    <span className="inline-block w-16">{data.blackoutConfirmer || ""}</span>
                    <span>(서명)</span>
                  </div>
                  <div className="px-2 py-1 text-xs text-foreground flex items-center gap-1 flex-wrap min-h-[26px]">
                    <span>※ 전원복구: 요청자</span>
                    <span className="inline-block w-20">{data.blackoutRequester || ""}</span>
                    <span>/ 복구시간:</span>
                    <span className="inline-block w-20">{data.blackoutRecoveryTime || ""}</span>
                    <span>확인자:</span>
                    <span className="inline-block w-16">{data.blackoutRecoveryConfirmer || ""}</span>
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
                    <Checkbox checked={!!data.supplementaryChecks?.[suppCheckKey("굴착","가스기계")]} disabled className="rounded-none h-3.5 w-3.5" />
                    <Checkbox checked={!!data.supplementaryConfirms?.[suppCheckKey("굴착","가스기계")]} disabled className="rounded-full h-3.5 w-3.5" />
                    <span>/ 점검자:</span>
                    <span className="inline-block w-20">{data.excavationInspector1 || ""}</span>
                  </div>
                  <div className="px-2 py-1 text-xs text-foreground flex items-center gap-1 flex-wrap min-h-[26px]">
                    <span>- 설비: 전기,계장,통신</span>
                    <Checkbox checked={!!data.supplementaryChecks?.[suppCheckKey("굴착","전기계장")]} disabled className="rounded-none h-3.5 w-3.5" />
                    <Checkbox checked={!!data.supplementaryConfirms?.[suppCheckKey("굴착","전기계장")]} disabled className="rounded-full h-3.5 w-3.5" />
                    <span>/ 점검자:</span>
                    <span className="inline-block w-16">{data.excavationInspector2 || ""}</span>
                    <span>허가기간:</span>
                    <span className="inline-block w-16">{data.excavationPeriodFrom || ""}</span>
                    <span>~</span>
                    <span className="inline-block w-16">{data.excavationPeriodTo || ""}</span>
                    <span>확인자:</span>
                    <span className="inline-block w-12">{data.excavationConfirmer || ""}</span>
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
                    <Checkbox checked={!!data.supplementaryChecks?.[suppCheckKey("고소","발판난간")]} disabled className="rounded-none h-3.5 w-3.5" />
                    <Checkbox checked={!!data.supplementaryConfirms?.[suppCheckKey("고소","발판난간")]} disabled className="rounded-full h-3.5 w-3.5" />
                    <span>/ 안전대 착용, 부착</span>
                    <Checkbox checked={!!data.supplementaryChecks?.[suppCheckKey("고소","안전대")]} disabled className="rounded-none h-3.5 w-3.5" />
                    <Checkbox checked={!!data.supplementaryConfirms?.[suppCheckKey("고소","안전대")]} disabled className="rounded-full h-3.5 w-3.5" />
                    <span>/ 추락방지망</span>
                    <Checkbox checked={!!data.supplementaryChecks?.[suppCheckKey("고소","추락방지")]} disabled className="rounded-none h-3.5 w-3.5" />
                    <Checkbox checked={!!data.supplementaryConfirms?.[suppCheckKey("고소","추락방지")]} disabled className="rounded-full h-3.5 w-3.5" />
                  </div>
                  <div className="px-2 py-1 text-xs text-foreground flex items-center gap-1 flex-wrap min-h-[26px]">
                    <span>- 허가기간:</span>
                    <span className="inline-block w-24">{data.heightPeriodFrom || ""}</span>
                    <span>~</span>
                    <span className="inline-block w-24">{data.heightPeriodTo || ""}</span>
                    <span>확인자</span>
                    <span className="inline-block w-16">{data.heightConfirmer || ""}</span>
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
                    <span className="inline-block w-24">{data.heavyEquipment || ""}</span>
                    <span>) / 자격증 소지</span>
                    <Checkbox checked={!!data.supplementaryChecks?.[suppCheckKey("중장비","자격증")]} disabled className="rounded-none h-3.5 w-3.5" />
                    <Checkbox checked={!!data.supplementaryConfirms?.[suppCheckKey("중장비","자격증")]} disabled className="rounded-full h-3.5 w-3.5" />
                    <span>/ 현장책임자 감독</span>
                    <Checkbox checked={!!data.supplementaryChecks?.[suppCheckKey("중장비","감독")]} disabled className="rounded-none h-3.5 w-3.5" />
                    <Checkbox checked={!!data.supplementaryConfirms?.[suppCheckKey("중장비","감독")]} disabled className="rounded-full h-3.5 w-3.5" />
                  </div>
                  <div className="px-2 py-1 text-xs text-foreground flex items-center gap-1 flex-wrap min-h-[26px]">
                    <span>- 기상, 노면상태</span>
                    <Checkbox checked={!!data.supplementaryChecks?.[suppCheckKey("중장비","노면")]} disabled className="rounded-none h-3.5 w-3.5" />
                    <Checkbox checked={!!data.supplementaryConfirms?.[suppCheckKey("중장비","노면")]} disabled className="rounded-full h-3.5 w-3.5" />
                    <span>/ 전선, 설비 간섭</span>
                    <Checkbox checked={!!data.supplementaryChecks?.[suppCheckKey("중장비","간섭")]} disabled className="rounded-none h-3.5 w-3.5" />
                    <Checkbox checked={!!data.supplementaryConfirms?.[suppCheckKey("중장비","간섭")]} disabled className="rounded-full h-3.5 w-3.5" />
                    <span>/ 신호수배치</span>
                    <Checkbox checked={!!data.supplementaryChecks?.[suppCheckKey("중장비","신호수")]} disabled className="rounded-none h-3.5 w-3.5" />
                    <Checkbox checked={!!data.supplementaryConfirms?.[suppCheckKey("중장비","신호수")]} disabled className="rounded-full h-3.5 w-3.5" />
                    <span>/ 매트 등 부속장구</span>
                    <Checkbox checked={!!data.supplementaryChecks?.[suppCheckKey("중장비","부속장구")]} disabled className="rounded-none h-3.5 w-3.5" />
                    <Checkbox checked={!!data.supplementaryConfirms?.[suppCheckKey("중장비","부속장구")]} disabled className="rounded-full h-3.5 w-3.5" />
                  </div>
                  <div className="px-2 py-1 text-xs text-foreground flex items-center gap-1 flex-wrap min-h-[26px]">
                    <span>- 운전원 허가기간:</span>
                    <span className="inline-block w-24">{data.heavyPeriodFrom || ""}</span>
                    <span>~</span>
                    <span className="inline-block w-24">{data.heavyPeriodTo || ""}</span>
                    <span>/ 확인자:</span>
                    <span className="inline-block w-16">{data.heavyConfirmer || ""}</span>
                    <span>(서명)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 가스농도 측정 */}
          <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm mb-6">
            <div className="flex border-b border-border">
              <div className="w-20 shrink-0 bg-primary/10 flex items-center justify-center border-r border-border">
                <span className="text-xs font-bold text-foreground text-center leading-tight">가스농도<br/>측정</span>
              </div>
              <div className="flex-1">
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
                {(() => {
                  const rows = data.gasRows || [];
                  const half = Math.ceil(rows.length / 2);
                  const rowCount = half;
                  return Array.from({ length: rowCount }).map((_, i) => {
                    const leftRow = rows[i];
                    const rightRow = rows[i + half];
                    return (
                      <div key={i} className="grid grid-cols-8 border-b border-border last:border-b-0">
                        {(["substance", "result", "time", "measurer"] as const).map((field) => (
                          <div key={`left-${field}`} className={`${field === "measurer" ? "border-r-2" : "border-r"} border-border px-1 py-4 text-[10px] text-foreground text-center`}>
                            {leftRow?.[field] || ""}
                          </div>
                        ))}
                        {(["substance", "result", "time", "measurer"] as const).map((field, fIdx) => (
                          <div key={`right-${field}`} className={`${fIdx < 3 ? "border-r border-border" : ""} px-1 py-4 text-[10px] text-foreground text-center`}>
                            {rightRow?.[field] || ""}
                          </div>
                        ))}
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
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
                    <div className="flex-1 px-1 text-[10px] text-foreground">{data.completionTime || ""}</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-14 shrink-0 px-2 py-2 bg-muted text-[10px] font-medium text-foreground">확인자:</div>
                    <div className="flex-1 px-1 text-[10px] text-foreground">{data.completionConfirmer || ""}</div>
                    <span className="text-[10px] text-muted-foreground px-2 shrink-0">(서명)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-24 shrink-0 px-2 py-2 bg-muted text-[10px] font-medium text-foreground">복원(조치)상태:</div>
                    <div className="flex-1 px-1 text-[10px] text-foreground">{data.completionRestoration || ""}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 안전조치확인 */}
          <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm mb-4">
            <div className="flex">
              <div className="w-20 shrink-0 bg-primary/10 flex items-center justify-center border-r border-border">
                <span className="text-xs font-bold text-foreground text-center leading-tight">안전조치<br/>확인</span>
              </div>
              <div className="flex-1">
                <div className="grid grid-cols-2 divide-x divide-border">
                  <div className="flex items-center">
                    <div className="w-14 shrink-0 px-2 py-2 bg-muted text-[10px] font-medium text-foreground">담당자</div>
                    <div className="flex-1 px-1 text-[10px] text-foreground">{data.safetyConfirmPerson || ""}</div>
                    <span className="text-[10px] text-muted-foreground px-2 shrink-0">(서명)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-14 shrink-0 px-2 py-2 bg-muted text-[10px] font-medium text-foreground">승인자</div>
                    <div className="flex-1 px-1 text-[10px] text-foreground">{data.safetyConfirmApprover || ""}</div>
                    <span className="text-[10px] text-muted-foreground px-2 shrink-0">(서명)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 작업허가 연장 */}
          <p className="text-[10px] text-destructive mb-1 px-1">※ 작업 연장시 작성 및 승인 必</p>
          <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm mb-4">
            <div className="flex">
              <div className="w-20 shrink-0 bg-primary/10 flex items-center justify-center border-r border-border">
                <span className="text-xs font-bold text-foreground text-center leading-tight">작업허가<br/>연장</span>
              </div>
              <div className="flex-1 px-3 py-3">
                <div className="flex items-end gap-2 flex-wrap">
                  <div className="flex items-center gap-1">
                    <span className="inline-block w-16 text-center text-sm text-foreground">{data.extensionYear || ""}</span>
                    <span className="text-xs text-foreground">년</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="inline-block w-12 text-center text-sm text-foreground">{data.extensionMonth || ""}</span>
                    <span className="text-xs text-foreground">월</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="inline-block w-12 text-center text-sm text-foreground">{data.extensionDay || ""}</span>
                    <span className="text-xs text-foreground">일</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="inline-block w-14 text-center text-sm text-foreground">{data.extensionFrom || ""}</span>
                    <span className="text-xs text-foreground whitespace-nowrap">시부터</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="inline-block w-14 text-center text-sm text-foreground">{data.extensionTo || ""}</span>
                    <span className="text-xs text-foreground whitespace-nowrap">시 까지</span>
                  </div>
                  <div className="flex items-center gap-1 ml-auto">
                    <span className="text-xs text-foreground whitespace-nowrap">신청인</span>
                    <span className="inline-block w-24 text-center text-sm text-foreground">{data.extensionApplicant || ""}</span>
                    <span className="text-[10px] text-muted-foreground shrink-0">(서명)</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 justify-end mt-2">
                  <span className="text-xs text-foreground whitespace-nowrap">승인자</span>
                  <span className="inline-block w-24 text-center text-sm text-foreground">{data.extensionApprover || ""}</span>
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
                    <div className="flex-1 px-1 text-xs text-foreground">{data.contractorPosition || ""}</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-14 shrink-0 px-2 py-2 bg-muted text-xs font-medium text-foreground">성명</div>
                    <div className="flex-1 px-1 text-xs text-foreground">{data.contractorName || ""}</div>
                    <span className="text-[10px] text-muted-foreground px-2 shrink-0">(서명)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        
      </div>
    </div>
  );
};

const ROField = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center">
    <div className="w-28 shrink-0 px-4 py-3 bg-muted text-sm font-medium text-foreground">{label}</div>
    <div className="flex-1 px-3 py-2 text-sm text-foreground">{value || ""}</div>
  </div>
);

export default AdminView;
