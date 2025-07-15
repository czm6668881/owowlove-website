-- 更新产品描述
UPDATE products 
SET description = 'Adorable cow-themed bikini set featuring playful black and white pattern. Perfect for costume parties, themed events, or adding fun to your swimwear collection. Made with comfortable, high-quality materials.'
WHERE name = 'Cow Bikini';

UPDATE products 
SET description = 'Elegant and alluring knight-inspired costume featuring medieval design elements. Perfect for role-playing, costume parties, or themed events. Crafted with attention to detail and comfortable fit.'
WHERE name = 'Sexy knight uniform';

UPDATE products 
SET description = 'Mysterious and captivating spider succubus costume combining dark elegance with supernatural allure. Features intricate web-inspired details and dramatic silhouette. Perfect for Halloween or fantasy-themed events.'
WHERE name = 'Spider Succubus';

-- 验证更新结果
SELECT name, description FROM products WHERE is_active = true;
