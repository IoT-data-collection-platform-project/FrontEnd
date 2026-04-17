import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch, ensureCsrfToken, readApiMessage } from "./api";

const PASSWORD_POLICY =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d\s])\S{8,12}$/;

function Signup() {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    ensureCsrfToken().catch(() => {
      setMessage("보안 토큰을 불러오지 못했습니다.");
    });
  }, []);

  const signup = async () => {
    if (!id.trim() || !pw.trim() || !email.trim()) {
      setMessage("아이디, 비밀번호, 이메일을 입력해주세요.");
      return;
    }

    if (!PASSWORD_POLICY.test(pw)) {
      setMessage(
        "비밀번호는 8~12자이며 대문자, 소문자, 숫자, 특수문자를 모두 포함해야 합니다."
      );
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await apiFetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: id, password: pw, email }),
      });

      if (!res.ok) {
        setMessage(await readApiMessage(res, "회원가입에 실패했습니다."));
        return;
      }

      setMessage(await readApiMessage(res, "회원가입 성공"));
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 800);
    } catch {
      setMessage("서버에 연결할 수 없습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-form">
          <input
            value={id}
            placeholder="아이디"
            onChange={(e) => setId(e.target.value)}
          />
          <input
            value={pw}
            type="password"
            placeholder="비밀번호"
            onChange={(e) => setPw(e.target.value)}
          />
          <p className="auth-message">
            비밀번호는 8~12자, 대문자/소문자/숫자/특수문자를 포함해야 합니다.
          </p>
          <input
            value={email}
            placeholder="이메일"
            onChange={(e) => setEmail(e.target.value)}
          />
          {message && <p className="auth-message">{message}</p>}
          <button onClick={signup} disabled={loading}>
            {loading ? "처리 중..." : "회원가입"}
          </button>
          <button
            type="button"
            className="secondary-button"
            onClick={() => navigate("/")}
            disabled={loading}
          >
            로그인으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}

export default Signup;
