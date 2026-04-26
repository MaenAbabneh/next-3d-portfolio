/**
 * GOOEY_SIDEBAR_LAYOUT - تحكم شامل بتصميم وسرعات الـ Sidebar
 *
 * يتم تقسيم الإعدادات حسب الأجهزة (desktop/mobile) لتوفير تجربة محسّنة لكل حجم شاشة
 *
 * 📐 أبعاد (خيارات للتعديل):
 *   - dotSize: حجم كل نقطة (icon)
 *   - slotSize: المسافة الكاملة بين النقاط (يشمل المسافة الفارغة + حجم الأيقونة)
 *   - padding: هامش الحافة العلوي/السفلي
 *   - width: عرض الـ Sidebar
 *
 * ⏱️ سرعات الانميشن (بالثواني - يمكن تعديلها بسهولة):
 *   - revealDuration: ظهور الـ Sidebar عند البداية
 *   - railDuration: حركة السكة المرئية (للأيقونات)
 *   - blobDuration: حركة الدائرة الزرقاء (المؤشر)
 *   - closeDuration: (موبايل فقط) إغلاق الـ panel
 *   - collapseDuration: (موبايل فقط) تقليص الخط والـ blob
 *   - railOverlap: تداخل التأثيرات (لا تعدّل عادة)
 *
 * 💡 نصائح:
 *   🔧 تعديل المسافة بين الأيقونات:
 *      - زيادة slotSize = مسافة أكبر بين الأيقونات
 *      - خفض slotSize = أيقونات أقرب من بعضها
 *      - المسافة الفارغة = slotSize - dotSize
 *      - مثال: desktop → slotSize:54, dotSize:52 = 2 بكسل مسافة فقط
 *
 *   ⏱️ تعديل السرعات:
 *      - لتسريع جميع الانميشنات: اضرب القيم × 0.8
 *      - لإبطاء جميع الانميشنات: اضرب القيم × 1.2
 */
export const GOOEY_SIDEBAR_LAYOUT = {
  desktop: {
    // 📐 أبعاد الأيقونة والتباعد
    dotSize: 52, // 📏 حجم كل icon (بكسل)
    slotSize: 68, // 📏 المسافة الكاملة من icon لآخر (dotSize + الفراغ = 52 + 2 = 54)
    padding: 8, // 📏 الهامش العلوي والسفلي (من خط أول icon للحافة)
    width: 86, // 📏 عرض الـ Sidebar الكلي

    // ⏱️ سرعات الانميشن (بالثواني)
    revealDuration: 0.65, // مدة ظهور الـ Sidebar عند الدخول للصفحة
    railDuration: 0.5, // سرعة حركة السكة بين الأيقونات
    blobDuration: 0.64, // سرعة حركة المؤشر (الدائرة الزرقاء)
    railOverlap: 0.06, // تداخل التأثيرات (لا تعدّل)
  },
  mobile: {
    // 📐 أبعاد الأيقونة والتباعد
    dotSize: 44, // 📏 حجم كل icon أصغر من desktop
    slotSize: 46, // 📏 المسافة الكاملة من icon لآخر (44 + 2 = 46)
    padding: 8, // 📏 الهامش (نفس desktop للاتساق)
    width: 68, // 📏 عرض أصغر للموبايل

    // ⏱️ سرعات الانميشن (بالثواني) - أسرع من desktop
    revealDuration: 0.26, // ظهور الـ Sidebar
    railDuration: 0.26, // حركة السكة
    blobDuration: 0.3, // حركة المؤشر
    closeDuration: 0.18, // مدة إغلاق الـ panel (الزر الدوار)
    collapseDuration: 0.2, // مدة تقليص الخط والـ blob عند الإغلاق
    railOverlap: 0.06, // تداخل التأثيرات (لا تعدّل)
  },
} as const;

/**
 * GOOEY_SIDEBAR_FILTER - تأثيرات SVG (Gooey Effect)
 *
 * 🎨 التأثيرات البصرية التي تعطي المظهر اللزج "الجيلاتيني"
 */
export const GOOEY_SIDEBAR_FILTER = {
  idPrefix: "gooey-sidebar", // معرّف فريد لكل مثيل من الـ Sidebar
  blurStdDeviation: 14, // درجة التمويه (كلما زادت = أكثر نعومة وسيولة)
  colorMatrixValues: "1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9", // مصفوفة اللون (لا تعدّل)
} as const;

/**
 * GOOEY_SIDEBAR_VIEW - فئات التنسيق والموضع
 *
 * 📍 معلومات الموضع والتصنيفات:
 *   - containerClass: التنسيق الخارجي (موضع الـ Sidebar)
 *   - railClass: فئة الـ SVG للسكة
 *   - panelClass: موضع الـ panel عند فتحه
 *   - panelEnterX: المسافة الأفقية للـ panel عند الدخول
 */
export const GOOEY_SIDEBAR_VIEW = {
  desktop: {
    containerClass: "left-6 top-1/2 -translate-y-1/2", // يسار الشاشة، في المنتصف عمودياً
    railClass: "relative", // موضع نسبي
    panelEnterX: -18, // مسافة الدخول من اليسار
  },
  mobile: {
    containerClass: "bottom-6 right-6 md:bottom-auto md:right-auto", // يمين-أسفل الشاشة
    panelClass: "absolute bottom-18 right-0", // الـ panel يظهر أعلى الـ FAB
  },
} as const;

/**
 * حساب الارتفاع الكلي للـ Sidebar
 *
 * @param count - عدد الأيقونات
 * @param dotSize - حجم الأيقونة
 * @param slotSize - المسافة الكاملة بين الأيقونات (من مركز أيقونة لمركز الأيقونة التالية)
 * @param padding - الهامش العلوي والسفلي
 *
 * @returns الارتفاع الكلي بالبكسل
 *
 * 📝 حساب الارتفاع:
 *    الارتفاع = max(
 *      dotSize + padding*2,
 *      (عدد الأيقونات - 1) × slotSize + dotSize + padding*2
 *    )
 *
 * 📊 مثال عملي (Desktop):
 *    - 8 أيقونات، dotSize:52، slotSize:54، padding:8
 *    - الارتفاع = (8-1) × 54 + 52 + 8×2 = 378 + 52 + 16 = 446 بكسل
 *
 * 💡 الصيغة تضمن أن:
 *    - كل أيقونة تحصل على مساحة slotSize (ما عدا الأخيرة)
 *    - هناك هامش من padding في الأعلى والأسفل
 */
export const getRailHeight = (
  count: number,
  dotSize: number,
  slotSize: number,
  padding: number,
) =>
  Math.max(
    dotSize + padding * 2,
    (count - 1) * slotSize + dotSize + padding * 2,
  );

/**
 * حساب موضع Y المركزي لأيقونة معينة
 *
 * @param index - رقم الأيقونة (0, 1, 2, ...)
 * @param dotSize - حجم الأيقونة
 * @param slotSize - المسافة الكاملة بين الأيقونات
 * @param padding - الهامش العلوي
 *
 * @returns موضع Y المركزي بالبكسل
 *
 * 📝 الحساب: padding + (dotSize / 2) + (index × slotSize)
 *
 * 📊 مثال (، slotSize:54، dotSize:52، padding:8، index:2):
 *    Y = 8 + 26 + (2 × 54) = 8 + 26 + 108 = 142 بكسل
 *
 * 💡 الاستخدام:
 *    - يُستخدم لتمركز الـ blob (المؤشر الأزرق) على الأيقونة المحددة
 *    - يحسب موضع المركز تماماً من الأيقونة
 */
export const getCenterY = (
  index: number,
  dotSize: number,
  slotSize: number,
  padding: number,
) => padding + dotSize / 2 + index * slotSize;

/**
 * حساب موضع Y العلوي لأيقونة معينة
 *
 * @param index - رقم الأيقونة
 * @param slotSize - المسافة الكاملة بين الأيقونات
 * @param padding - الهامش العلوي
 *
 * @returns موضع Y العلوي بالبكسل
 *
 * 📝 الحساب: padding + (index × slotSize)
 *
 * 📊 مثال (padding:8، slotSize:54، index:2):
 *    Y = 8 + (2 × 54) = 8 + 108 = 116 بكسل
 *
 * 💡 الاستخدام:
 *    - يُستخدم لتمركز عناصر HTML (Links/Buttons) للأيقونات
 *    - يحسب الموضع العلوي لكل أيقونة (وليس المركز)
 *    - الفارق بين getCenterY و getTopY = dotSize / 2 (نصف حجم الأيقونة)
 */
export const getTopY = (index: number, slotSize: number, padding: number) =>
  padding + index * slotSize;

/**
 * حساب نقطة الأصل السفلى للخط (موبايل فقط)
 *
 * @param count - عدد الأيقونات
 * @param dotSize - حجم الأيقونة
 * @param slotSize - المسافة بين الأيقونات
 * @param padding - الهامش
 *
 * @returns نقطة الأصل السفلية بالبكسل
 *
 * 📝 نقطة الانطلاق للخط المتحرك في الموبايل (من داخل الـ FAB)
 */
export const getBottomOriginY = (
  count: number,
  dotSize: number,
  slotSize: number,
  padding: number,
) => getRailHeight(count, dotSize, slotSize, padding);
