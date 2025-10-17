# TODO: Make Website Responsive to All Screen Sizes

## 1. Enhance global.css
- Add media query for <360px: further reduce fonts/paddings, ensure 100% width.
- Improve table overflow with better scrolling.
- Make buttons min 44px height for touch.
- Add responsive utilities section (e.g., .d-none-mobile).

## 2. Update navbar.css
- Ensure mobile menu covers full height.
- Adjust logo/text for <320px.

## 3. Update home.css
- Stack hero search at 600px instead of 768px.
- Reduce hero padding on tiny screens.

## 4. Update dashboard.css
- On <479px, make sidebar items more compact.
- Ensure tables are fully scrollable without zoom.

## 5. Update doctor.css
- Make doctor cards stack at 600px instead of 768px.
- Adjust avatar sizes for smaller screens.

## 6. Update booking.css
- For time slots, use 2-column on <480px instead of 3.
- Ensure modal scroll works on small heights.

## 7. Update footer.css
- Add gap adjustments for stacked columns.

## 8. Add image/video responsiveness
- Ensure all images/videos use max-width:100%; height:auto; in global.css.

## 9. Test Responsiveness
- Run dev server.
- Test at various viewports: 1200px, 768px, 375px, 320px.
- Verify no horizontal overflow, touch-friendly elements.
