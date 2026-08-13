import {
  ArrowUpRight,
  Bell,
  Building2,
  CheckCircle2,
  Clock3,
  FileText,
  Heart,
  ImageIcon,
  Lightbulb,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { getCompanySlugByAdminId } from "../data/companies";
import type {
  AdminDashboardData,
  SimilarCompanyInsight,
  SuggestedTopic,
} from "../data/adminDashboard";
import styles from "./admin.module.css";

const notices = [
  {
    title: "テスト4",
    body: "短い説明テキスト",
    kind: "メモ",
  },
  {
    title: "コンテンツ掲載基準を更新しました",
    body: "「日本初」「No.1」等の表現に関する基準を更新しました。詳しくは通知をご確認ください。",
    kind: "重要",
  },
  {
    title: "WebクリッピングでSNS投稿の取得が可能になりました",
    body: "指定キーワードに基づきSNS投稿を自動で取得できます。",
    kind: "新機能",
  },
  {
    title: "企業ページの情報を充実させましょう！",
    body: "企業情報を更新すると、メディアが会社を理解しやすくなります。",
    kind: "おすすめ",
  },
  {
    title: "会社設立日を設定しましょう！",
    body: "周年に合わせた発信サジェストの精度が高まります。",
    kind: "おすすめ",
  },
  {
    title: "直近1か月間のデータ（2026/07/14 - 2026/08/13）のデータ",
    body: "配信結果と競合トレンドを確認できます。",
    kind: "レポート",
  },
];

function MetricCard({
  label,
  value,
  note,
  icon,
}: {
  label: string;
  value: string;
  note: string;
  icon: React.ReactNode;
}) {
  return (
    <article className={styles.metricCard}>
      <div className={styles.metricIcon}>{icon}</div>
      <div>
        <p className={styles.metricLabel}>{label}</p>
        <p className={styles.metricValue}>{value}</p>
        <p className={styles.metricNote}>{note}</p>
      </div>
    </article>
  );
}

function TopicCard({ topic, rank }: { topic: SuggestedTopic; rank: number }) {
  return (
    <article className={styles.topicCard}>
      <div className={styles.topicRank}>0{rank}</div>
      <div className={styles.topicContent}>
        <div className={styles.topicTopline}>
          <span className={styles.predictionLabel}>
            <Sparkles size={13} aria-hidden="true" /> 発信テーマ候補
          </span>
          <span className={styles.confidence}>今週のおすすめ</span>
        </div>
        <h3>{topic.title}</h3>
        <p>{topic.description}</p>
        <div className={styles.keywordRow}>
          {topic.keywords.map((keyword) => (
            <span key={keyword}>#{keyword}</span>
          ))}
        </div>
        <div className={styles.topicEvidence}>
          <Lightbulb size={15} aria-hidden="true" />
          <span>{topic.evidence}</span>
        </div>
      </div>
      <button className={styles.ghostButton} type="button">
        企画を作成 <ArrowUpRight size={15} aria-hidden="true" />
      </button>
    </article>
  );
}

function SimilarCompanyCard({ insight }: { insight: SimilarCompanyInsight }) {
  return (
    <article className={styles.similarCompanyCard}>
      <div
        aria-label={`${insight.latestRelease.title}のメイン画像`}
        className={styles.similarCompanyVisual}
        role="img"
        style={{
          backgroundImage: `linear-gradient(180deg, rgb(8 20 31 / 8%) 24%, rgb(8 20 31 / 88%) 100%), url("${insight.latestRelease.imageUrl}")`,
        }}
      >
        <span className={styles.similarVisualLabel}>
          <Sparkles size={13} aria-hidden="true" /> 発信のヒント
        </span>
        <div className={styles.similarVisualContent}>
          <span>{insight.latestRelease.category}</span>
          <h3>
            <Link href={`/companies/${getCompanySlugByAdminId(insight.company.companyId)}`}>
              {insight.company.name}
            </Link>
          </h3>
          <p>{insight.latestRelease.title}</p>
        </div>
      </div>
      <div className={styles.similarCompanyBody}>
        <div className={styles.similarDiscoveryTitle}>
          <Lightbulb size={15} aria-hidden="true" />
          この企業から見つかる視点
        </div>
        <div className={styles.reasonRow}>
          {insight.reasons.map((reason) => (
            <span key={reason}>{reason}</span>
          ))}
        </div>
        <p className={styles.similarCompanyDescription}>
          {insight.company.description}
        </p>
        <Link
          className={styles.similarCompanyLink}
          href={`/companies/${getCompanySlugByAdminId(insight.company.companyId)}`}
        >
          発信内容を見る <ArrowUpRight size={14} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

export default function AdminDashboard({ data }: { data: AdminDashboardData }) {
  return (
    <div className={styles.dashboard}>
      <header className={styles.dashboardHeader}>
        <div>
          <p className={styles.breadcrumb}>企業管理 / ダッシュボード</p>
          <h1 className={styles.pageTitle}>PR Activity</h1>
          <p className={styles.pageLead}>
            伝えたいことを見つけ、アイデアを育てる。今日の広報を楽しみましょう。
          </p>
        </div>
        <div className={styles.headerActions}>
          <div className={styles.companySwitcher}>
            <Building2 size={18} aria-hidden="true" />
            <div>
              <span>company_id: {data.company.companyId}</span>
              <strong>
                <Link href={`/companies/${getCompanySlugByAdminId(data.company.companyId)}`}>
                  {data.company.name}
                </Link>
              </strong>
            </div>
          </div>
          <button className={styles.primaryButton} type="button">
            <FileText size={16} aria-hidden="true" />
            プレスリリースを作成
          </button>
        </div>
      </header>

      <section className={styles.metrics} aria-label="広報活動のヒント">
        <MetricCard
          label="次の企画のタネ"
          value="新しいヒントが届いています"
          note="気になる切り口から企画を育てましょう"
          icon={<Sparkles size={19} />}
        />
        <MetricCard
          label="これまでの発信"
          value="積み重ねが物語になっています"
          note="過去のPRは次の発信につながる資産です"
          icon={<FileText size={19} />}
        />
        <MetricCard
          label="近い企業から発見"
          value="新しい見せ方を見つけました"
          note="写真とテーマから発信の世界を広げます"
          icon={<ImageIcon size={19} />}
        />
        <MetricCard
          label="今日の広報"
          value="伝えたい気持ちから始めよう"
          note="小さなニュースも誰かに届く一歩です"
          icon={<Heart size={19} />}
        />
      </section>

      <section className={styles.latestRelease}>
        <div className={styles.sectionIcon}>
          <Clock3 size={19} aria-hidden="true" />
        </div>
        <div className={styles.latestReleaseContent}>
          <div className={styles.sectionEyebrow}>LATEST RELEASE</div>
          <h2>{data.latestRelease.title}</h2>
          <p>{data.latestRelease.summary}</p>
        </div>
        <div className={styles.latestReleaseMeta}>
          <span className={styles.statusLive}>
            <CheckCircle2 size={14} aria-hidden="true" /> 配信済み
          </span>
          <time dateTime={data.latestRelease.startedAt}>
            {data.latestRelease.formattedStartedAt} 開始
          </time>
          <strong>届けたい人へ公開中</strong>
        </div>
      </section>

      <div className={styles.insightGrid}>
        <section className={`${styles.panel} ${styles.similarPanel}`}>
          <div className={styles.panelHeader}>
            <div>
              <div className={styles.sectionEyebrow}>VISUAL INSPIRATION</div>
              <h2>インスピレーションをくれる企業</h2>
              <p>近い企業が、どんな写真と切り口でニュースを届けているか見てみましょう。</p>
            </div>
            <span className={styles.aiBadge}>
              <ImageIcon size={14} aria-hidden="true" /> 写真から発見
            </span>
          </div>
          <div className={styles.similarCompanyList}>
            {data.similarCompanies.map((insight) => (
              <SimilarCompanyCard key={insight.company.companyId} insight={insight} />
            ))}
          </div>
          <p className={styles.inferenceNote}>
            業種や事業内容、発信テーマの共通点から、企画づくりの参考になる企業を選んでいます。
          </p>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <div className={styles.sectionEyebrow}>NEXT CONTENT</div>
              <h2>次に発信できそうなテーマ</h2>
              <p>気になったテーマから、自由に次の企画をふくらませてみましょう。</p>
            </div>
            <span className={styles.aiBadge}>
              <Sparkles size={14} aria-hidden="true" /> アイデアのタネ
            </span>
          </div>
          <div className={styles.topicList}>
            {data.suggestedTopics.map((topic, index) => (
              <TopicCard key={topic.title} topic={topic} rank={index + 1} />
            ))}
          </div>
        </section>
      </div>

      <section className={styles.noticeSection}>
        <div className={styles.noticeHeader}>
          <div>
            <div className={styles.sectionEyebrow}>INFORMATION</div>
            <h2>お知らせ・運用メモ</h2>
          </div>
          <Bell size={20} aria-hidden="true" />
        </div>
        <div className={styles.noticeGrid}>
          {notices.map((notice) => (
            <article className={styles.noticeCard} key={notice.title}>
              <span>{notice.kind}</span>
              <h3>{notice.title}</h3>
              <p>{notice.body}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
