const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedAnalytics() {
  console.log('🌱 Seeding analytics data...');

  try {
    // Clear existing analytics events (optional)
    const existingCount = await prisma.analyticsEvent.count();
    console.log(`Found ${existingCount} existing analytics events`);

    // Generate events for the last 30 days
    const events = [];
    const now = new Date();

    // Generate page views
    for (let i = 0; i < 30; i++) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dayEvents = Math.floor(Math.random() * 20) + 5; // 5-25 events per day

      for (let j = 0; j < dayEvents; j++) {
        const eventTime = new Date(date.getTime() + Math.random() * 24 * 60 * 60 * 1000);
        const pages = ['/', '/about', '/services', '/contact', '/blog', '/dashboard', '/team', '/projects'];
        const userAgents = [
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
          'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        ];
        const referrers = ['', 'https://google.com', 'https://facebook.com', 'https://twitter.com', 'https://linkedin.com'];

        events.push({
          type: 'PAGE_VIEW',
          meta: {
            path: pages[Math.floor(Math.random() * pages.length)],
            userAgent: userAgents[Math.floor(Math.random() * userAgents.length)],
            referrer: referrers[Math.floor(Math.random() * referrers.length)]
          },
          createdAt: eventTime
        });
      }
    }

    // Generate form submissions (fewer than page views)
    for (let i = 0; i < 15; i++) {
      const date = new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000);
      events.push({
        type: 'FORM_SUBMIT',
        meta: {
          formId: Math.random() > 0.5 ? 'contact-form' : 'newsletter-form',
          path: Math.random() > 0.5 ? '/contact' : '/'
        },
        createdAt: date
      });
    }

    // Generate phone verifications
    for (let i = 0; i < 8; i++) {
      const date = new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000);
      events.push({
        type: 'PHONE_VERIFIED',
        meta: {
          phone: '+1***-***-' + Math.floor(Math.random() * 9000 + 1000),
          path: '/contact'
        },
        createdAt: date
      });
    }

    // Generate talent clicks
    for (let i = 0; i < 25; i++) {
      const date = new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000);
      const talents = ['talent-1', 'talent-2', 'talent-3'];
      const talentNames = ['John Doe', 'Jane Smith', 'Alex Johnson'];
      
      const talentIndex = Math.floor(Math.random() * talents.length);
      
      events.push({
        type: 'TALENT_CLICK',
        meta: {
          talentId: talents[talentIndex],
          talentName: talentNames[talentIndex],
          path: '/'
        },
        createdAt: date
      });
    }

    console.log(`📊 Creating ${events.length} analytics events...`);

    // Insert events in batches
    const batchSize = 50;
    for (let i = 0; i < events.length; i += batchSize) {
      const batch = events.slice(i, i + batchSize);
      await prisma.analyticsEvent.createMany({
        data: batch
      });
    }

    const totalEvents = await prisma.analyticsEvent.count();
    console.log(`✅ Successfully seeded analytics data! Total events: ${totalEvents}`);

    // Show summary
    const summary = await prisma.analyticsEvent.groupBy({
      by: ['type'],
      _count: {
        type: true
      }
    });

    console.log('\n📈 Event summary:');
    summary.forEach(item => {
      console.log(`  ${item.type}: ${item._count.type} events`);
    });

  } catch (error) {
    console.error('❌ Error seeding analytics data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding function
seedAnalytics(); 