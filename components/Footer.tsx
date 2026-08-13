"use client";

import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#182b45] text-white pt-10 pb-6 border-t border-gray-800">
      <div className="max-w-[1200px] mx-auto px-4">
        {/* About SEO Summary Box */}
        <div className="bg-[#122238] p-4 rounded border border-[#243d61] mb-8 text-xs text-gray-300 leading-relaxed">
          <h4 className="font-bold text-white mb-1.5">
            プレスリリース・ニュースリリース配信サービス PR TIMES
          </h4>
          <p>
            PR TIMES（ピーアールタイムズ）は、企業・団体の新商品・イベント・サービス開始などの最新ニュース・プレスリリースを、メディア関係者および生活者へダイレクトに届けるプレスリリース配信プラットフォームです。上場企業の50%以上、全国100,000社以上の企業・自治体に導入されています。
          </p>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8 text-xs">
          <div>
            <h5 className="font-bold text-sky-300 mb-3 border-b border-gray-700 pb-1">
              プレスリリース配信サービス
            </h5>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">PR TIMESとは</a></li>
              <li><a href="#" className="hover:text-white transition-colors">料金プラン・ご利用案内</a></li>
              <li><a href="#" className="hover:text-white transition-colors">配信規約・ご利用ガイド</a></li>
              <li><a href="#" className="hover:text-white transition-colors">成功事例・活用ノウハウ</a></li>
              <li><a href="#" className="hover:text-white transition-colors">セミナー・イベント情報</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-sky-300 mb-3 border-b border-gray-700 pb-1">
              PR TIMESの関連サービス
            </h5>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">PR TIMES STORY</a></li>
              <li><a href="#" className="hover:text-white transition-colors">PR TIMES MAGAZINE</a></li>
              <li><a href="#" className="hover:text-white transition-colors">PR TIMES TV</a></li>
              <li><a href="#" className="hover:text-white transition-colors">PR EDITOR</a></li>
              <li><a href="#" className="hover:text-white transition-colors">MARSH</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-sky-300 mb-3 border-b border-gray-700 pb-1">
              メディア関係者の方へ
            </h5>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">メディア会員登録（無料）</a></li>
              <li><a href="#" className="hover:text-white transition-colors">プレスリリース受信用設定</a></li>
              <li><a href="#" className="hover:text-white transition-colors">取材・掲載のリクエスト</a></li>
              <li><a href="#" className="hover:text-white transition-colors">提携メディア一覧</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-sky-300 mb-3 border-b border-gray-700 pb-1">
              企業情報・パートナー
            </h5>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">運営会社（株式会社PR TIMES）</a></li>
              <li><a href="#" className="hover:text-white transition-colors">IR・投資家情報</a></li>
              <li><a href="#" className="hover:text-white transition-colors">採用情報（キャリア）</a></li>
              <li><a href="#" className="hover:text-white transition-colors">地方創生・パートナーシップ</a></li>
            </ul>
          </div>
        </div>

        {/* Legal links and copyright */}
        <div className="pt-6 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-gray-400">
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
            <a href="#" className="hover:text-gray-200">会社概要</a>
            <span>|</span>
            <a href="#" className="hover:text-gray-200">プライバシーポリシー</a>
            <span>|</span>
            <a href="#" className="hover:text-gray-200">コンプライアンス</a>
            <span>|</span>
            <a href="#" className="hover:text-gray-200">利用規約</a>
            <span>|</span>
            <a href="#" className="hover:text-gray-200">お問い合わせ</a>
            <span>|</span>
            <a href="#" className="hover:text-gray-200">特定商取引法に基づく表記</a>
          </div>

          <p className="text-gray-400 font-mono">
            Copyright © PR TIMES Inc. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
