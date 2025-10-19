export const localVehicles = [
  {
    id: 1,
    model: 'Camry',
    year: 2025,
    category: 'sedan',
    image_url: './assets/camry.avif',
    trims: [
      { name: 'LE', msrp: 28700, mpg_city: 53, mpg_highway: 50 },
      { name: 'SE', msrp: 31000, mpg_city: 48, mpg_highway: 47 },
      { name: 'XLE', msrp: 33700, mpg_city: 48, mpg_highway: 47 },
      { name: 'XSE', msrp: 34900, mpg_city: 48, mpg_highway: 47 },
    ]
  },
  {
    id: 2,
    model: 'Corolla',
    year: 2025,
    category: 'sedan',
    image_url: 'https://www.toyota.com/imgix/responsive/images/mlp/colorizer/2025/corolla/040/1.png?w=1600&h=900&fm=webp&bg=white&q=75',
    trims: [
      { name: 'LE', msrp: 22325, mpg_city: 32, mpg_highway: 41 },
      { name: 'SE', msrp: 24765, mpg_city: 31, mpg_highway: 40 },
      { name: 'FX', msrp: 26650, mpg_city: 31, mpg_highway: 40 },
      { name: 'XSE', msrp: 28040, mpg_city: 31, mpg_highway: 40 },
    ]
  },
  {
    id: 3,
    model: 'RAV4',
    year: 2025,
    category: 'suv',
    image_url: 'https://www.toyota.com/imgix/responsive/images/mlp/colorizer/2025/rav4/040/1.png?w=1600&h=900&fm=webp&bg=white&q=75',
    trims: [
        { name: 'LE', msrp: 29550, mpg_city: 27, mpg_highway: 35 },
        { name: 'XLE', msrp: 31060, mpg_city: 27, mpg_highway: 35 },
        { name: 'XLE Premium', msrp: 33950, mpg_city: 27, mpg_highway: 35 },
        { name: 'Limited', msrp: 37855, mpg_city: 27, mpg_highway: 35 },
    ]
  },
  {
    id: 4,
    model: 'Highlander',
    year: 2025,
    category: 'suv',
    image_url: 'https://www.toyota.com/imgix/responsive/images/mlp/colorizer/2025/highlander/040/1.png?w=1600&h=900&fm=webp&bg=white&q=75',
    trims: [
        { name: 'LE', msrp: 40320, mpg_city: 22, mpg_highway: 29 },
        { name: 'XLE', msrp: 43470, mpg_city: 22, mpg_highway: 29 },
        { name: 'XSE', msrp: 47140, mpg_city: 22, mpg_highway: 29 },
        { name: 'Limited', msrp: 47575, mpg_city: 21, mpg_highway: 28 },
        { name: 'Platinum', msrp: 52725, mpg_city: 21, mpg_highway: 28 },
    ]
  },
  {
    id: 5,
    model: 'Tacoma',
    year: 2025,
    category: 'truck',
    image_url: 'https://www.toyota.com/imgix/responsive/images/mlp/colorizer/2025/tacoma/040/1.png?w=1600&h=900&fm=webp&bg=white&q=75',
    trims: [
        { name: 'SR', msrp: 31590, mpg_city: 20, mpg_highway: 23 },
        { name: 'SR5', msrp: 36220, mpg_city: 20, mpg_highway: 23 },
        { name: 'TRD PreRunner', msrp: 38120, mpg_city: 20, mpg_highway: 23 },
        { name: 'TRD Sport', msrp: 39400, mpg_city: 20, mpg_highway: 23 },
        { name: 'TRD Off-Road', msrp: 41800, mpg_city: 20, mpg_highway: 23 },
        { name: 'Limited', msrp: 52555, mpg_city: 20, mpg_highway: 23 },
    ]
  },
  {
    id: 6,
    model: 'Prius',
    year: 2025,
    category: 'hybrid',
    image_url: 'https://www.toyota.com/imgix/responsive/images/mlp/colorizer/2025/prius/040/1.png?w=1600&h=900&fm=webp&bg=white&q=75',
    trims: [
        { name: 'LE', msrp: 28495, mpg_city: 57, mpg_highway: 56 },
        { name: 'LE AWD', msrp: 29750, mpg_city: 53, mpg_highway: 54 },
        { name: 'XLE', msrp: 31795, mpg_city: 52, mpg_highway: 52 },
        { name: 'XLE AWD', msrp: 33195, mpg_city: 49, mpg_highway: 50 },
        { name: 'Limited', msrp: 35635, mpg_city: 52, mpg_highway: 52 },
        { name: 'Limited AWD', msrp: 36765, mpg_city: 49, mpg_highway: 50 },
    ]
  },
  {
    id: 7,
    model: 'Tundra',
    year: 2025,
    category: 'truck',
    image_url: 'https://www.toyota.com/imgix/responsive/images/mlp/colorizer/2025/tundra/040/1.png?w=1600&h=900&fm=webp&bg=white&q=75',
    trims: [
        { name: 'SR', msrp: 40090, mpg_city: 18, mpg_highway: 24 },
        { name: 'SR5', msrp: 45960, mpg_city: 18, mpg_highway: 24 },
        { name: 'Limited', msrp: 54305, mpg_city: 18, mpg_highway: 24 },
        { name: 'Platinum', msrp: 63675, mpg_city: 18, mpg_highway: 24 },
        { name: '1794 Edition', msrp: 64360, mpg_city: 18, mpg_highway: 24 },
    ]
  },
  {
    id: 8,
    model: '4Runner',
    year: 2025,
    category: 'suv',
    image_url: 'https://www.toyota.com/imgix/responsive/images/mlp/colorizer/2025/4runner/040/1.png?w=1600&h=900&fm=webp&bg=white&q=75',
    trims: [
        { name: 'SR5', msrp: 41270, mpg_city: 16, mpg_highway: 19 },
        { name: 'TRD Sport', msrp: 47750, mpg_city: 16, mpg_highway: 19 },
        { name: 'TRD Sport Premium', msrp: 53110, mpg_city: 16, mpg_highway: 19 },
        { name: 'TRD Off-Road', msrp: 49690, mpg_city: 16, mpg_highway: 19 },
        { name: 'TRD Off-Road Premium', msrp: 55470, mpg_city: 16, mpg_highway: 19 },
        { name: 'Limited', msrp: 55900, mpg_city: 16, mpg_highway: 19 },
    ]
  },
  {
    id: 9,
    model: 'Corolla Cross',
    year: 2025,
    category: 'suv',
    image_url: 'https://www.toyota.com/imgix/responsive/images/mlp/colorizer/2025/corollacross/040/1.png?w=1600&h=900&fm=webp&bg=white&q=75',
    trims: [
        { name: 'L', msrp: 24135, mpg_city: 31, mpg_highway: 33 },
        { name: 'LE', msrp: 26465, mpg_city: 31, mpg_highway: 33 },
        { name: 'XLE', msrp: 28360, mpg_city: 31, mpg_highway: 33 },
    ]
  },
  {
    id: 10,
    model: 'Grand Highlander',
    year: 2025,
    category: 'suv',
    image_url: 'https://www.toyota.com/imgix/responsive/images/mlp/colorizer/2025/grandhighlander/040/1.png?w=1600&h=900&fm=webp&bg=white&q=75',
    trims: [
        { name: 'LE', msrp: 40860, mpg_city: 21, mpg_highway: 28 },
        { name: 'XLE', msrp: 43630, mpg_city: 21, mpg_highway: 28 },
        { name: 'Limited', msrp: 48360, mpg_city: 20, mpg_highway: 26 },
        { name: 'Platinum', msrp: 54045, mpg_city: 20, mpg_highway: 26 },
    ]
  },
  {
    id: 11,
    model: 'bz4x',
    year: 2025,
    category: 'electric',
    image_url: 'https://www.toyota.com/imgix/responsive/images/mlp/colorizer/2025/bz4x/040/1.png?w=1600&h=900&fm=webp&bg=white&q=75',
    trims: [
        { name: 'XLE', msrp: 37070, mpg_city: 119, mpg_highway: 100 },
        { name: 'Nightshade', msrp: 40420, mpg_city: 119, mpg_highway: 100 },
        { name: 'Limited', msrp: 41800, mpg_city: 119, mpg_highway: 100 },
    ]
  },
  {
    id: 12,
    model: 'Sienna',
    year: 2025,
    category: 'van',
    image_url: 'https://www.toyota.com/imgix/responsive/images/mlp/colorizer/2025/sienna/040/1.png?w=1600&h=900&fm=webp&bg=white&q=75',
    trims: [
        { name: 'LE', msrp: 39485, mpg_city: 36, mpg_highway: 36 },
        { name: 'XLE', msrp: 44295, mpg_city: 36, mpg_highway: 36 },
        { name: 'XSE', msrp: 46940, mpg_city: 36, mpg_highway: 36 },
        { name: 'Woodland Edition', msrp: 50725, mpg_city: 35, mpg_highway: 36 },
        { name: 'Limited', msrp: 50500, mpg_city: 36, mpg_highway: 36 },
        { name: 'Platinum', msrp: 56445, mpg_city: 36, mpg_highway: 36 },
    ]
  }
];
