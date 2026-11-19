/*
 * Waitlist sign-ups, saved straight to Supabase's REST API with fetch (no
 * client library). Without config (js/config.js) the forms run in demo mode.
 */
(function () {
  var cfg = K.config || {};
  var url = (cfg.supabaseUrl || '').replace(/\/+$/, '');
  var key = cfg.supabaseAnonKey || '';

  K.isSupabaseConfigured = Boolean(url && key && url !== 'https://your-project-id.supabase.co');

  // Email is optional and left out of the request when empty.
  function optionalEmail(data) {
    return data.email ? { email: data.email } : {};
  }

  function insert(table, row, data) {
    if (!K.isSupabaseConfigured) {
      console.warn('[Kovera] Supabase is not configured (js/config.js). Running in demo mode.', data);
      return new Promise(function (resolve) {
        setTimeout(function () { resolve({ success: true, mock: true }); }, 400);
      });
    }
    return fetch(url + '/rest/v1/' + table, {
      method: 'POST',
      headers: {
        apikey: key,
        Authorization: 'Bearer ' + key,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify([row]),
    }).then(function (res) {
      if (res.ok) return { success: true };
      return res.text().then(function (body) {
        var error = new Error('Supabase insert failed (' + res.status + ')');
        try { Object.assign(error, JSON.parse(body)); } catch (e) { error.details = body; }
        console.error('[Kovera] Failed to save to ' + table + ':', error);
        throw error;
      });
    });
  }

  /** data: { businessName, contactName, phone, workLocation, supportNeed, email? } */
  K.submitBusinessRegistration = function (data) {
    return insert('business_registrations', Object.assign({
      business_name: data.businessName,
      contact_name: data.contactName,
      phone_number: data.phone || data.phoneNumber || null,
      work_location: data.workLocation || null,
      support_need: data.supportNeed || null,
    }, optionalEmail(data)), data);
  };

  /** data: { fullName, phone, locality, experience, availability, email? } */
  K.submitWorkerRegistration = function (data) {
    return insert('worker_registrations', Object.assign({
      full_name: data.fullName,
      phone_number: data.phone || data.phoneNumber || null,
      locality: data.locality,
      experience: data.experience || null,
      availability: data.availability || null,
    }, optionalEmail(data)), data);
  };
})();
