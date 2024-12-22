import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const ForgotPasswordValidation = z.object({
  email: z.string().email("Invalid email address").nonempty("Email is required"),
});

const ForgotPasswordForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof ForgotPasswordValidation>>({
    resolver: zodResolver(ForgotPasswordValidation),
    defaultValues: {
      email: "",
    },
  });

  const handleForgotPassword = async () => {
    // Simulate API call for sending reset link
    toast({ title: "Password reset link sent to your email." });
    form.reset();
    navigate("/sign-in");
  };

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">Forgot Password</h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">
          Enter your email to receive password reset instructions.
        </p>
        <form
          onSubmit={form.handleSubmit(handleForgotPassword)}
          className="flex flex-col gap-5 w-full mt-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Email</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="shad-button_primary">
            Send Reset Link
          </Button>
        </form>
      </div>
    </Form>
  );
};

export default ForgotPasswordForm;
