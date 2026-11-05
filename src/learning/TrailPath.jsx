import React, { useEffect, useState } from 'react';

// Mede os blocos reais para acompanhar a mudança de largura e a quebra dos textos.
export default function TrailPath({
  containerRef
}) {
  const [geometry, setGeometry] = useState({
    path: '',
    width: 1,
    height: 1
  });
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const measure = () => {
      const origin = container.getBoundingClientRect();
      const points = Array.from(container.querySelectorAll('li button')).map(button => {
        const bounds = button.getBoundingClientRect();
        return {
          x: bounds.left - origin.left + bounds.width / 2,
          y: bounds.top - origin.top + bounds.height / 2
        };
      });
      const path = points.reduce((drawing, point, index) => {
        if (index === 0) return `M ${point.x} ${point.y}`;
        const previous = points[index - 1];
        const distance = point.y - previous.y;
        const direction = point.x >= previous.x ? 1 : -1;
        const bend = Math.min(32, Math.min(previous.x, point.x) - 5);
        return `${drawing} C ${previous.x + direction * bend} ${previous.y + distance * .45}, ${point.x + direction * bend} ${point.y - distance * .45}, ${point.x} ${point.y}`;
      }, '');
      setGeometry({
        path,
        width: container.clientWidth,
        height: container.offsetHeight
      });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    container.querySelectorAll('li').forEach(node => observer.observe(node));
    return () => observer.disconnect();
  }, [containerRef]);
  return <svg className="trail-connector" width={geometry.width} height={geometry.height} aria-hidden="true"><path d={geometry.path} fill="none" stroke="var(--trail-line)" strokeWidth="5" strokeDasharray="7 10" strokeLinecap="round" /></svg>;
}
