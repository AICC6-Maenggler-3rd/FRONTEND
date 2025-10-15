export function Footer() {
  const footerLinks = [
    { name: '서비스 이용 약관', href: '#' },
    { name: '개인정보 처리방침', href: '#' },
    { name: '위치정보 이용약관', href: '#' },
    { name: '서비스 이용정책', href: '#' },
  ];

  return (
    <footer className="bg-muted/30 border-t border-border">
      <div className="container mx-auto px-6 py-16">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center space-x-2">
            <img
              src="/image/inpik.png"
              alt="Inpik 로고 아이콘"
              className="w-20 h-20 absolute"
              style={{
                top: '30%',
                left: '47%',
                transform: 'translate(-50%, -50%)',
              }}
            />
            <span className="text-3xl font-bold text-foreground tracking-tight">
              InPick
            </span>
          </div>

          <div className="flex flex-wrap justify-center gap-10 text-sm mt-4">
            {footerLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="text-muted-foreground hover:text-primary transition-colors duration-200 no-underline font-medium"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="text-center text-xs text-muted-foreground mt-4">
            <p>&copy; 2025 InPick. All rights reserved.</p>
            <p className="mt-1">AI 기반 맞춤형 여행 일정 플래너</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
