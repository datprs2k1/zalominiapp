export const normalizeHtml = (html: string): string => {
  if (typeof window === 'undefined' || !html) return html;
  const parser = new window.DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // Xoá toàn bộ class và style của mọi phần tử
  doc.querySelectorAll('*').forEach((el) => {
    el.removeAttribute('class');
    el.removeAttribute('style');
  });

  // Ảnh
  doc.querySelectorAll('img').forEach((img) => {
    img.setAttribute('loading', 'lazy');
    img.classList.add('block', 'mx-auto', 'max-w-full', 'h-auto', 'object-contain', 'bg-gray-100', 'my-4');
    img.onerror = function () {
      (this as HTMLImageElement).style.display = 'none';
    };
  });

  // Bảng
  doc.querySelectorAll('table').forEach((table) => {
    table.classList.add(
      'w-full',
      'overflow-x-auto',
      'text-xs',
      'md:text-sm',
      'min-w-[400px]',
      'md:min-w-full',
      'border',
      'border-gray-300',
      'mb-4',
      'last:mb-0'
    );
  });
  doc.querySelectorAll('th').forEach((th) => {
    th.classList.add('border', 'border-gray-300', 'px-2', 'py-1', 'md:px-4', 'md:py-2', 'bg-gray-100', 'font-semibold');
  });
  doc.querySelectorAll('td').forEach((td) => {
    td.classList.add('border', 'border-gray-300', 'px-2', 'py-1', 'md:px-4', 'md:py-2');
  });

  // Danh sách
  doc.querySelectorAll('ul').forEach((ul) => {
    ul.classList.add('list-disc', 'pl-5', 'mb-4', 'last:mb-0');
  });
  doc.querySelectorAll('ol').forEach((ol) => {
    ol.classList.add('list-decimal', 'pl-5', 'mb-4', 'last:mb-0');
  });
  doc.querySelectorAll('li').forEach((li) => {
    li.classList.add('mb-1', 'last:mb-0');
  });

  // Blockquote
  doc.querySelectorAll('blockquote').forEach((bq) => {
    bq.classList.add(
      'border-l-4',
      'border-blue-400',
      'pl-4',
      'italic',
      'text-gray-600',
      'text-sm',
      'md:text-base',
      'my-4',
      'mb-4',
      'last:mb-0'
    );
  });

  // Link
  doc.querySelectorAll('a').forEach((a) => {
    a.classList.add('text-blue-600', 'hover:underline', 'break-all');
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
  });

  // Heading
  doc.querySelectorAll('h1').forEach((h) => {
    h.classList.add('text-2xl', 'font-bold', 'mt-4', 'mb-4', 'last:mb-0');
  });
  doc.querySelectorAll('h2').forEach((h) => {
    h.classList.add('text-xl', 'font-bold', 'mt-4', 'mb-4', 'last:mb-0');
  });
  doc.querySelectorAll('h3').forEach((h) => {
    h.classList.add('text-lg', 'font-semibold', 'mt-3', 'mb-4', 'last:mb-0');
  });
  doc.querySelectorAll('h4').forEach((h) => {
    h.classList.add('text-base', 'font-semibold', 'mt-3', 'mb-4', 'last:mb-0');
  });
  doc.querySelectorAll('h5').forEach((h) => {
    h.classList.add('text-sm', 'font-semibold', 'mt-2', 'mb-4', 'last:mb-0');
  });
  doc.querySelectorAll('h6').forEach((h) => {
    h.classList.add('text-xs', 'font-semibold', 'mt-2', 'mb-4', 'last:mb-0');
  });

  // Đoạn văn
  doc.querySelectorAll('p').forEach((p) => {
    p.classList.add('mb-4', 'last:mb-0', 'text-gray-800', 'text-base');
  });

  return doc.body.innerHTML;
};

export default normalizeHtml;
