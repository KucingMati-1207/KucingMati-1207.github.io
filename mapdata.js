// ─────────────────────────────
// GEOFIELD MAP DATABASE
// ─────────────────────────────

const MAP_DATABASE = {

  cultural: [
        {
      name: 'Taman Budaya Sulbar',
      subtitle: 'Cultural Park',
      category: 'Cultural',
      lat: -3.5058477190248625,
      lng: 119.02641064001419,
      image: 'assets/images/taman_budaya.jpg'
    },
    {
      name: 'Balai Kesenian Desa Campurjo',
      subtitle: 'Traditional Arts Center',
      category: 'Cultural',
      lat: -3.4112544071232147,
      lng: 119.23225994472715,
      image: 'assets/images/balai_kesenian.jpg'
    },
  ],

  culinary: [
    {
      name: 'Sari Laut Bahari',
      subtitle: 'UMKM',
      category: 'Culinary',
      lat: -3.4370596430042526,
      lng: 119.34788012806196,
      //image: 'https:////images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop'
    },
    {
      name: 'Warung Kondang',
      subtitle: 'UMKM',
      category: 'Culinary',
      lat: -3.390932494242388,
      lng: 119.22317951862969,
      //image: 'https:////images.unsplash.com/photo-1495521821757-a1efb6729352?w=400&h=300&fit=crop'
    },
    {
      name: 'Warung Solo',
      subtitle: 'UMKM',
      category: 'Culinary',
      lat: -3.4062509949216753,
      lng: 119.21121952028496,
      //image: 'https:////images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop'
    }
  ],

  nature: [
    {
      name: 'Air Terjun Indo Rannuang',
      subtitle: 'Eco Tourism Waterfall',
      category: 'Nature',
      lat: -3.3510559878846373,
      lng: 119.39684173061418,
      //image: 'https:////images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=400&h=300&fit=crop'
    },
    {
      name: 'Pantai Palippis',
      subtitle: 'Karang Eksotis Pantai Barat',
      category: 'Nature',
      lat: -3.510186333528223,
      lng: 119.09746375970555,
      //image: 'https:////images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop'
    },
    {
      name: 'Pantai Mampie',
      subtitle: 'Konservasi Penyu & Eduwisata',
      category: 'Nature',
      lat: -3.4540040448722245,
      lng: 119.28051011972492,
      //image: 'https:////images.unsplash.com/photo-1505142468610-359e7d316be0?w=400&h=300&fit=crop'
    },
    {
      name: 'Wisata Alam Rumede',
      subtitle: 'Sungai Berbatu Anreapi',
      category: 'Nature',
      lat: -3.3717107578505727,
      lng: 119.37143171612793,
      //image: 'https:////images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop'
    },
    {
      name: 'Pulau Gusung Toraja',
      subtitle: 'Wisata Pasir Putih',
      category: 'Nature',
      lat: -3.488829033624112,
      lng: 119.38925034723785,
      //image: 'https:////images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=300&fit=crop'
    },
    {
      name: 'Pemandian Alam Kali Biru Kanang',
      subtitle: 'River Resort',
      category: 'Nature',
      lat: -3.4142729669495107,
      lng: 119.40385971473366,
      //image: 'https:////images.unsplash.com/photo-1439066615861-d1af74d74000?w=400&h=300&fit=crop'
    },
    {
      name: 'Pulau Battoa',
      subtitle: 'Island Destination',
      category: 'Nature',
      lat: -3.475104884095937,
      lng: 119.368855433894,
      //image: 'https:////images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=300&fit=crop'
    },
    {
      name: 'Pantai Bahari',
      subtitle: 'City Green Belt Coast',
      category: 'Nature',
      lat: -3.4382996880219427,
      lng: 119.34894825715885,
      //image: 'https:////images.unsplash.com/photo-1495954484750-af469f1357be?w=400&h=300&fit=crop'
    },
    {
      name: 'Kebun Raya Bulo',
      subtitle: 'Botanical Park',
      category: 'Nature',
      lat: -3.217992180155879,
      lng: 119.15933537374572,
      //image: 'https:////images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop'
    },
    {
      name: 'Pantai Lapeo',
      subtitle: 'Beach Area',
      category: 'Nature',
      lat: -3.4944502769895607,
      lng: 119.13402283914795,
      //image: 'https:////images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=300&fit=crop'
    },
    {
      name: 'Air Terjun Limbong Kamandang',
      subtitle: 'Wisata Alam',
      category: 'Nature',
      lat: -3.2837114812180532,
      lng: 119.31407125728092,
      //image: 'https:////images.unsplash.com/photo-1439066615861-d1af74d74000?w=400&h=300&fit=crop'
    },
    {
      name: 'Air Terjun Sarambu Tai Bai',
      subtitle: 'Mountain Stream Cascade',
      category: 'Nature',
      lat: -3.4060413180091915,
      lng: 119.45954485552247,
      //image: 'https:////images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=400&h=300&fit=crop'
    },
  ],

  hangout: [
    {
      name: 'Alun-alun Kota Polewali',
      subtitle: 'Local Gathering Place',
      category: 'Hangout',
      lat: -3.408129253955284,
      lng: 119.31264090900616,
      //image: 'https:////images.unsplash.com/photo-1511576661531-b34c7a5d15bb?w=400&h=300&fit=crop'
    },
    {
      name: 'Salam Coffee Roaster',
      subtitle: 'Coffee Shop',
      category: 'Hangout',
      lat: -3.4338959805092935,
      lng: 119.34442921968181,
      //image: 'https:////images.unsplash.com/photo-1495474472902-4d71bcdd2085?w=400&h=300&fit=crop'
    },
    {
      name: 'Spot Mancing Baronang Alek cs',
      subtitle: 'Fishing Spot',
      category: 'Hangout',
      lat: -3.4378185581577476,
      lng: 119.29226102602154,
      //image: 'https:////images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop'
    },
    {
      name: 'Sunset View Pantai Cendrawasih',
      subtitle: 'Hangout Spot',
      category: 'Hangout',
      lat: -3.4268380246660413,
      lng: 119.31169896417282,
      //image: 'https:////images.unsplash.com/photo-1495567720989-cebecf900795?w=400&h=300&fit=crop'
    },
    {
      name: 'Taman Bahari',
      subtitle: 'Taman',
      category: 'Hangout',
      lat: -3.4391352452016672,
      lng: 119.34938063590064,
      //image: 'https:////images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=300&fit=crop'
    },
    {
      name: 'Naichi Cafe',
      subtitle: 'Cafe',
      category: 'Hangout',
      lat: -3.397409545480558,
      lng: 119.217645654043,
      //image: 'https:////images.unsplash.com/photo-1521017914020-fea9c673eae0?w=400&h=300&fit=crop'
    }

  ]

};