import { defineMessage } from "./i18n";
import { useBindLocale } from "./LocaleContext";

// i18nデータの定義
const profileI18n = defineMessage()
  .add({
    title: {
      en: "User Profile",
      ja: "ユーザープロフィール",
      zh: "用户资料",
    },
    role: {
      en: "Role",
      ja: "役割",
      zh: "角色",
    },
    bio: {
      en: "Bio",
      ja: "自己紹介",
      zh: "简介",
    },
    edit: {
      en: "Edit Profile",
      ja: "プロフィール編集",
      zh: "编辑资料",
    },
    greeting: (ctx: { name: string; role: string; bio: string }) => ({
      en: `Welcome, ${ctx.name}!`,
      ja: `ようこそ、${ctx.name}さん！`,
      zh: `欢迎，${ctx.name}！`,
    }),
    stats: (ctx: { name: string; role: string; bio: string }) => ({
      en: `Current role: ${ctx.role}`,
      ja: `現在の役割: ${ctx.role}`,
      zh: `当前角色：${ctx.role}`,
    }),
  });

// コンポーネント
export function ProfileCard() {
  const m = useBindLocale(profileI18n);

  const user = {
    name: "Tanaka Taro",
    role: "Developer",
    bio: "Passionate about building great software",
  };

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "24px",
        maxWidth: "400px",
        margin: "20px auto",
        background: "white",
      }}
    >
      <h2>{m.title()}</h2>
      <div style={{ marginTop: "16px" }}>
        {m.greeting(user)}
      </div>
      <div style={{ marginTop: "12px" }}>
        {m.stats(user)}
      </div>
      <div style={{ marginTop: "16px" }}>
        <div style={{ fontWeight: "600" }}>{m.bio()}</div>
        <p style={{ color: "#555", marginTop: "8px" }}>{user.bio}</p>
      </div>
      <button
        style={{
          marginTop: "16px",
          padding: "8px 16px",
          background: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        {m.edit()}
      </button>
    </div>
  );
}
