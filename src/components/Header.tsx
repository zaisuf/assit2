import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="w-full py-6 px-8 flex items-center justify-between bg-transparent z-50">
      <div className="flex items-center gap-6">
        <span className="text-sm font-orbitron font-normal bg-gradient-to-r from-secondary-cyan to-accent-gold text-transparent bg-clip-text select-none font-sans" style={{fontFamily: 'sans-serif'}}>
          makelAI
        </span>
      </div>
      <nav className="flex gap-6 items-center tracking-wide">
        <a href="#features" className="text-white/80 hover:text-white font-normal transition-colors font-sans text-xs" style={{fontFamily: 'sans-serif'}}>Features</a>
        <a href="#pricing" className="text-white/80 hover:text-white font-normal transition-colors font-sans text-xs" style={{fontFamily: 'sans-serif'}}>Features</a>
        <a href="#about" className="text-white/80 hover:text-white font-normal transition-colors font-sans text-xs" style={{fontFamily: 'sans-serif'}}>About</a>
        <a href="#contact" className="text-white/80 hover:text-white font-normal transition-colors font-sans text-xs" style={{fontFamily: 'sans-serif'}}>Contact</a>
      </nav>
      <div className="flex gap-4">
        <a href="/login" className="px-5 py-2 rounded font-bold shadow hover:scale-105 transition-transform" style={{
          background: 'linear-gradient(90deg,rgb(72, 98, 129) 0%,rgb(125, 106, 182) 100%)',
          color: 'white',
          fontFamily: 'sans-serif',
          minWidth: '150px',
          borderColor: 'transparent',
          borderWidth: '2px',
          borderStyle: 'solid',
        }}>Login</a>
      </div>
    </header>
  );
};

export default Header;
