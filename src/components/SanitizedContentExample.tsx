import React from 'react';
import { HtmlContentDisplay } from './HtmlContentDisplay';

const SanitizedContentExample: React.FC = () => {
  const sampleContent = `
    <section class="section" id="section_852721257">
      <div class="section-bg fill">
      </div>
      <div class="section-content relative">
        <div class="row" id="row-1961613766">
          <div class="col medium-6 small-12 large-6">
            <div class="col-inner">
              <div id="gap-1331450058" class="gap-element clearfix" style="display:block; height:auto;"></div>
              <h1><span style="font-size: 100%;">KHÁM SẢN, PHỤ KHOA TỔNG QUÁT</span></h1>
              <p style="text-align: justify;">Tại Bệnh viện Đa khoa Hòa Bình – Hải Dương, dịch vụ khám <strong>Sản phụ khoa tổng quát</strong> và <strong>điều trị vô sinh – hiếm muộn</strong> được triển khai toàn diện với sự tham gia của các chuyên gia đầu ngành.</p>
              <div class="icon-box featured-box icon-box-left text-left" style="margin:0px 0px 10px 0px;">
                <div class="icon-box-img" style="width: 20px">
                  <div class="icon">
                    <div class="icon-inner">
                      <img loading="lazy" decoding="async" width="18" height="16" src="/icons/checkmark.png" class="attachment-medium size-medium" alt="" />
                    </div>
                  </div>
                </div>
                <div class="icon-box-text last-reset">
                  <p>Khám chuyên gia Bệnh viện Phụ sản Trung ương</p>
                </div>
              </div>
            </div>
          </div>
          <div class="col medium-6 small-12 large-6">
            <div class="col-inner">
              <div class="wpcf7 no-js" id="wpcf7-f4669-o1">
                <form action="/contact" method="post" class="wpcf7-form init" novalidate="novalidate">
                  <div class="form-group2">
                    <h2 class="cf7-title" style="padding-top:0px">ĐĂNG KÝ TƯ VẤN</h2>
                  </div>
                  <div class="form-group2">
                    <p>
                      <span class="wpcf7-form-control-wrap" data-name="your-name">
                        <input size="40" maxlength="400" class="wpcf7-form-control wpcf7-text wpcf7-validates-as-required" id="name" aria-required="true" aria-invalid="false" placeholder="Nhập họ tên của bạn" value="" type="text" name="your-name" />
                      </span>
                    </p>
                  </div>
                  <div class="form-group2">
                    <p>
                      <span class="wpcf7-form-control-wrap" data-name="your-phone">
                        <input size="40" maxlength="400" class="wpcf7-form-control wpcf7-tel wpcf7-validates-as-required wpcf7-text wpcf7-validates-as-tel" id="phone" aria-required="true" aria-invalid="false" placeholder="Nhập số điện thoại của bạn" value="" type="tel" name="your-phone" />
                      </span>
                    </p>
                  </div>
                  <div class="form-group2">
                    <p>
                      <input class="wpcf7-form-control wpcf7-submit has-spinner btn-submit-dichvu" type="submit" value="Đăng ký ngay" />
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Nội dung đã được xử lý với Tailwind CSS</h2>
      <div className="bg-white shadow-md rounded-lg p-6">
        <HtmlContentDisplay htmlContent={sampleContent} />
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Hướng dẫn sử dụng:</h3>
        <ol className="list-decimal pl-6 space-y-2">
          <li>
            Import component <code className="bg-gray-100 px-1 py-0.5 rounded">HtmlContentDisplay</code> từ file tương
            ứng
          </li>
          <li>
            Truyền nội dung HTML cần xử lý vào props{' '}
            <code className="bg-gray-100 px-1 py-0.5 rounded">htmlContent</code>
          </li>
          <li>Component sẽ tự động xử lý và áp dụng các class Tailwind CSS phù hợp</li>
          <li>Các thuộc tính style inline, class gốc và các định dạng không an toàn sẽ bị loại bỏ</li>
          <li>Form elements sẽ được giữ nguyên chức năng nhưng được định dạng với Tailwind</li>
        </ol>
      </div>
    </div>
  );
};

export default SanitizedContentExample;
