import { ItemDoPedido } from '@prisma/client';

export const calculateTotal = (itens: ItemDoPedido[]) =>
  itens.reduce(
    (acc: number, item: ItemDoPedido) =>
      acc + Number(item.precoPorUnidade) * item.quantidade,
    0,
  );
