import React from 'react';
import { useForm } from 'react-hook-form';
import { toast, Toaster } from 'sonner';
import { insertNotification, createSupabaseServerClient } from '@/lib/supabase';

interface ContactFormInputs {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export default function LandingPage() {
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<ContactFormInputs>();

  React.useEffect(() => {
    const supabase = createSupabaseServerClient();
    const channel = supabase
      .channel('notifications')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, (payload) => {
        if (payload.new.type === 'message' || payload.new.type === 'reply') {
          toast.info(`New ${payload.new.type === 'message' ? 'message' : 'reply'} notification!`);
        }
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const onSubmit = async (data: ContactFormInputs) => {
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const result = await res.json();
        if (result.id) {
          await insertNotification('message', result.id);
        }
        toast.success('Message sent successfully!');
        reset();
      } else {
        toast.error('Failed to send message. Please try again.');
      }
    } catch (err) {
      toast.error('Failed to send message. Please try again.');
    }
  };

  return (
    <div className="bg-black text-white min-h-screen">
      <Toaster position="top-center" richColors />
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center py-24 bg-gradient-to-b from-black to-gray-900">
        <h1 className="text-5xl font-extrabold mb-4 text-center">
          Welcome to <span className="text-red-500">Torch</span>
        </h1>
        <p className="text-lg text-gray-300 mb-8 text-center max-w-xl">
          Empowering businesses through innovative digital solutions and strategic partnerships.
        </p>
        <button className="bg-red-600 hover:bg-red-700 px-8 py-3 rounded text-lg font-semibold transition">Explore Torch</button>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <h2 className="text-3xl font-bold text-center mb-10">Our Services</h2>
        <div className="flex flex-col md:flex-row gap-8 justify-center max-w-4xl mx-auto">
          <div className="bg-gray-800 rounded-lg p-8 flex-1 text-center shadow-lg">
            <h3 className="text-xl font-semibold mb-2">Media Press</h3>
            <p className="text-gray-400">Strategic media exposure and press for your brand, amplifying your voice to the right audiences.</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-8 flex-1 text-center shadow-lg">
            <h3 className="text-xl font-semibold mb-2">Talent Support</h3>
            <p className="text-gray-400">Comprehensive talent management and development to help you reach your full potential.</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-8 flex-1 text-center shadow-lg">
            <h3 className="text-xl font-semibold mb-2">Marketing Systems</h3>
            <p className="text-gray-400">Innovative marketing solutions to boost your digital presence and engagement.</p>
          </div>
        </div>
      </section>

      {/* About + Sub-Brands Section */}
      <section className="py-20 bg-black">
        <h2 className="text-3xl font-bold text-center mb-6">About Torch Group</h2>
        <p className="text-gray-400 text-center max-w-2xl mx-auto mb-10">
          At Torch Group, we ignite creativity and empower talent to shape the future of digital content. Our vision is to deliver excellence through technology, strategy, and collaboration.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <h4 className="font-semibold text-lg mb-2">Torch Star</h4>
            <p className="text-gray-400 text-sm">Our creative agency for visionary brands.</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <h4 className="font-semibold text-lg mb-2">Torch Shop</h4>
            <p className="text-gray-400 text-sm">Your destination for Torch merchandise.</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <h4 className="font-semibold text-lg mb-2">Torch Loop</h4>
            <p className="text-gray-400 text-sm">A digital space for talent and innovation.</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <h4 className="font-semibold text-lg mb-2">Torch Law</h4>
            <p className="text-gray-400 text-sm">Legal solutions for creators and businesses.</p>
          </div>
        </div>
      </section>

      {/* Talents Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <h2 className="text-3xl font-bold text-center mb-10">Torch Talents</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {[1,2,3,4].map((i) => (
            <div key={i} className="bg-gray-800 rounded-lg p-6 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-gray-700 rounded-full mb-4" />
              <h5 className="font-semibold mb-1">Talent {i}</h5>
              <span className="text-gray-400 text-sm">Role {i}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-black">
        <h2 className="text-3xl font-bold text-center mb-6">Get in Touch</h2>
        <p className="text-gray-400 text-center mb-8">Let's discuss your next project</p>
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl mx-auto bg-gray-900 rounded-lg p-8 flex flex-col gap-4 shadow-lg">
          <div className="flex flex-col md:flex-row gap-4">
            <input {...register('name', { required: true })} type="text" placeholder="Name" className="flex-1 p-3 rounded bg-gray-800 text-white placeholder-gray-500 focus:outline-none" />
            <input {...register('email', { required: true })} type="email" placeholder="Email" className="flex-1 p-3 rounded bg-gray-800 text-white placeholder-gray-500 focus:outline-none" />
          </div>
          <input {...register('phone')} type="text" placeholder="Phone Number" className="p-3 rounded bg-gray-800 text-white placeholder-gray-500 focus:outline-none" />
          <textarea {...register('message', { required: true })} placeholder="Message" rows={4} className="p-3 rounded bg-gray-800 text-white placeholder-gray-500 focus:outline-none" />
          <button type="submit" disabled={isSubmitting} className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded text-lg font-semibold transition mt-2 disabled:opacity-50">
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </section>
    </div>
  );
} 