"use client"

import {
  changeRoleAttendant
} from "@/actions/attendants/change-role-attendants"
import { SpanErrorMessage } from "@/components/span-error"
import { toast } from "@/components/toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { queryClient } from "@/providers/theme-provider"
import { zodResolver } from "@hookform/resolvers/zod"
import { Role, User } from "@prisma/client"
import { useMutation } from "@tanstack/react-query"
import { Eye, EyeClosed } from "lucide-react"
import { ReactNode, useState } from "react"
import { useForm } from "react-hook-form"
import z from "zod"

interface DropdownMenuItemAlertProps {
  children: ReactNode
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  icon?: ReactNode
  disabled?: boolean
  user: User
  setDropdownOpen: (open: boolean) => void
}

const dropdownMenuItemAlertSchema = z.object({
  adminPassword: z
    .string()
    .nonempty("A senha é obrigatória"),
  newRole: z
    .enum(["ADMIN", "SUPERVISOR", "USER"])
})

type DropdownMenuItemAlertFormProps =
  z.infer<typeof dropdownMenuItemAlertSchema>

export function DropdownMenuItemAlert({
  children,
  title,
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  icon,
  disabled = false,
  user,
  setDropdownOpen
}: DropdownMenuItemAlertProps) {

  const roles = ["ADMIN", "SUPERVISOR", "USER"] as const

  const [open, setOpen] = useState(false)
  const [visible, setVisible] = useState(false)

  const Icon = visible ? Eye : EyeClosed

  const {
    mutate,
    isPending: isLoading
  } = useMutation({
    mutationKey: ["change-role-attendant"],
    mutationFn: changeRoleAttendant,
    onSuccess: ({ name, role }) => {
      toast({
        title: "O cargo foi atualizado",
        description: `O usuário ${name} agora é um ${role}`,
        onAutoClose: () => {
          setDropdownOpen(false)
          setOpen(false)
        }
      })
      queryClient.invalidateQueries({ queryKey: ["find-many-attendants"] })
    }
  })

  const {
    setValue,
    watch,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<DropdownMenuItemAlertFormProps>({
    resolver: zodResolver(dropdownMenuItemAlertSchema),
    defaultValues: {
      adminPassword: undefined
    }
  })

  const adminPassword = watch("adminPassword")

  function onSubmit({
    adminPassword, newRole
  }: DropdownMenuItemAlertFormProps) {
    mutate({
      adminPassword,
      newRole,
      attendantId: user.id
    })
  }

  return (
    <form>
      <DropdownMenuItem
        disabled={disabled}
        onSelect={(e) => {
          e.preventDefault()
          setOpen(true)
        }}
      >
        {icon && <span className="mr-2">{icon}</span>}
        {children}
      </DropdownMenuItem>

      <AlertDialog
        open={open}
        onOpenChange={setOpen}
      >
        <AlertDialogContent className="w-1/3">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {title}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-6">
            <Select
              defaultValue={user.role ?? undefined}
              onValueChange={(value) => setValue("newRole", value as Role)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {
                    roles.map(role => (
                      <SelectItem
                        key={role}
                        value={role}
                      >
                        {role}
                      </SelectItem>
                    ))
                  }
                </SelectGroup>
              </SelectContent>
            </Select>
            <div className="flex flex-col gap-2.5">
              <Label >
                Digite sua senha para confirmar troca de cargo:
              </Label>
              <InputGroup className="bg-input">
                <InputGroupInput
                  placeholder="*******"
                  type={visible ? "text" : "password"}
                  {...register("adminPassword")}
                />
                <InputGroupAddon align="inline-end">
                  <Button
                    variant="ghost"
                    onClick={() => setVisible(visible => !visible)}
                  >
                    <Icon />
                  </Button>
                </InputGroupAddon>
              </InputGroup>
              {
                errors.adminPassword && (
                  <SpanErrorMessage message={errors.adminPassword.message} />
                )
              }
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel
              variant={"destructive"}
              disabled={isLoading}
              className="w-1/3"
            >
              {cancelText}
            </AlertDialogCancel>
            <AlertDialogAction
              type="submit"
              disabled={isLoading || !adminPassword}
              className="w-1/3"
              onClick={(e) => {
                e.preventDefault()
                handleSubmit(onSubmit)()
              }}
            >
              {isLoading ? <Spinner /> : confirmText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </form>
  )
}
