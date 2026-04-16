import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch, ensureCsrfToken, readApiMessage } from "./api";

function Auth() {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    ensureCsrfToken().catch(() => {
      if (active) {
        setMessage("보안 토큰을 불러오지 못했습니다.");
      }
    });

    apiFetch("/api/auth/me")
      .then((response) => {
        if (active && response.ok) {
          navigate("/weather", { replace: true });
        }
      })
      .catch(() => {
        if (active) {
          setMessage("");
        }
      });

    return () => {
      active = false;
    };
  }, [navigate]);

  // 로그인
  const login = async () => {
    if (!id.trim() || !pw.trim()) {
      setMessage("아이디와 비밀번호를 입력해주세요.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await apiFetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: id, password: pw }),
      });

      if (!res.ok) {
        setMessage(await readApiMessage(res, "로그인에 실패했습니다."));
        return;
      }

      setMessage(await readApiMessage(res, "로그인 성공"));
      navigate("/weather", { replace: true });
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
          {message && <p className="auth-message">{message}</p>}
          <button onClick={login} disabled={loading}>
            {loading ? "처리 중..." : "로그인"}
          </button>
          <button
            type="button"
            className="secondary-button"
            onClick={() => navigate("/signup")}
            disabled={loading}
          >
            회원가입
          </button>
        </div>
      </div>
    </div>
  );
}

export default Auth;