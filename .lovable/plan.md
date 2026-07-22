
## Plan

### What to change

**1. About Us image replacement**
- Copy `user-uploads://IMG-20250927-WA0017.jpg` to `src/assets/about-shop.jpg`
- In `AboutSection.tsx`:
  - Change import from `about-steel.jpg` → `about-shop.jpg`
  - Remove the decorative yellowish border div (`<div className="absolute -top-4 -left-4 w-full h-full border-2 border-secondary rounded-sm z-0" />`)
  - Remove `relative` wrapper complexity, keep clean image with `object-cover` fitting perfectly

**2. Contact details audit (all look correct already)**
- Footer: address ✓, phones ✓, email kiransteels1088@gmail.com ✓
- Contact section: email kiransteels1088@gmail.com ✓, phones ✓, address ✓

### Files to edit
- `src/assets/about-shop.jpg` — new asset (copy from upload)
- `src/components/AboutSection.tsx` — swap image import + remove border div
