"use server";

interface PlanRequestData {
  plan: {
    title: string;
    price: string;
    buttonLinkID: string;
  };
  addons: string[];
  location: string;
  contact: {
    name: string;
    email: string;
    phone: string;
    message: string;
  };
}

interface ActionResponse {
  success: boolean;
  error?: string;
}

export async function submitPlanRequest(data: PlanRequestData): Promise<ActionResponse> {
  try {
    // Validation
    if (!data.contact.email || !data.contact.name) {
      return { success: false, error: "Email y Nombre son obligatorios." };
    }

    // In a real scenario, we would use Resend or Nodemailer here.
    // Example:
    // await resend.emails.send({
    //   from: 'onbast@updates.com',
    //   to: 'info@onbast.com',
    //   subject: `Nueva Solicitud de Plan: ${data.plan.title} en ${data.location}`,
    //   react: EmailTemplate({ ...data })
    // });

    console.log("--- NEW PLAN REQUEST RECEIVED ---");
    console.log("Plan:", data.plan.title);
    console.log("Location:", data.location);
    console.log("Addons:", data.addons);
    console.log("Contact:", data.contact);
    console.log("---------------------------------");

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return { success: true };
  } catch (error) {
    console.error("Error submitting plan:", error);
    return { success: false, error: "Error interno del servidor." };
  }
}
